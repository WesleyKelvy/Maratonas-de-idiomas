import { GoogleGenAI } from '@google/genai';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Report } from '@prisma/client';
import {
  AbstractAiFeedbackService,
  AI_FEEDBACK_SERVICE_TOKEN,
} from 'src/AiFeedback/abstract-services/abstract-aiFeedback.service';
import {
  AbstractClassroomService,
  CLASSROOM_SERVICE_TOKEN,
} from 'src/Classroom/abstract-services/abstract-classrom.service';
import { AbstractReportService } from 'src/Report/abstract-services/abstract-report.service';
import { createReportGenerationPrompt } from 'src/Report/ai/createReportGenerationPrompt';
import { CreateReport } from 'src/Report/types/createReport.type';
import { ReportType } from 'src/Report/types/report.type';
import { ReportDetailsType } from 'src/Report/types/reportDetails.type';
import {
  AbstractReportRepository,
  REPORT_REPOSITORY_TOKEN,
} from 'src/repositories/abstract/report.repository';

type FinalReportData = {
  explanation: string;
  category: string;
};

@Injectable()
export class ReportService implements AbstractReportService {
  constructor(
    @Inject(CLASSROOM_SERVICE_TOKEN)
    private readonly classroomService: AbstractClassroomService,
    @Inject(AI_FEEDBACK_SERVICE_TOKEN)
    private readonly aiFeedbackService: AbstractAiFeedbackService,
    @Inject(REPORT_REPOSITORY_TOKEN)
    private readonly reportRepository: AbstractReportRepository,
    @Inject()
    private readonly gemini: GoogleGenAI,
  ) {
    this.gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  async findByMarathonId(marathonId: string): Promise<Report> {
    return await this.reportRepository.findByMarathonId(marathonId);
  }

  async createReport(marathonId: string): Promise<Report> {
    const [classroom, aiFeedbacks] = await Promise.all([
      this.classroomService.findOneByMarathonId(marathonId),
      this.aiFeedbackService.findAllByMarathonId(marathonId),
    ]);

    if (!classroom) {
      throw new HttpException(
        'Classroom not found for the given marathon.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (aiFeedbacks.length === 0) {
      throw new HttpException(
        'No feedback available to generate a report.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const dataToCreateFinalReport: FinalReportData[] = aiFeedbacks.map(
      ({ explanation, category }) => ({ explanation, category }),
    );

    const { report } = await this.createFinalReport(dataToCreateFinalReport);

    const reportData: CreateReport = {
      classroom_name: classroom.name,
      marathon_id: marathonId,
      total_errors: report.total_errors,
      report_details: {
        create: report.categories.map((category) => ({
          category_name: category.category_name,
          occurrences: category.occurrences,
          examples: JSON.stringify(category.examples),
          targeted_advice: category.targeted_advice,
        })),
      },
    };

    return await this.reportRepository.createReport(reportData);
  }

  // current refectoring
  async createFinalReport(errors: FinalReportData[]): Promise<ReportType> {
    try {
      const total_errors = errors.length;

      // Step 1: Group explanations by category. This is a fast, in-memory operation.
      const categoryMap = new Map<string, { explanations: string[] }>();
      for (const error of errors) {
        if (!categoryMap.has(error.category)) {
          categoryMap.set(error.category, { explanations: [] });
        }
        categoryMap.get(error.category).explanations.push(error.explanation);
      }

      // Step 2: Create a promise for each category using the new helper function.
      const reportCategoryPromises = this._generateAdvicePromises(categoryMap);

      // Step 3: Execute all advice generation promises in parallel.
      const reportCategories = await Promise.all(reportCategoryPromises);

      return {
        report: {
          total_errors,
          categories: reportCategories,
        },
      };
    } catch (error) {
      console.error('Error in createFinalReport:', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private _generateAdvicePromises(
    categoryMap: Map<string, { explanations: string[] }>,
  ): Promise<ReportDetailsType>[] {
    return Array.from(categoryMap.entries()).map(
      async ([categoryName, data]) => {
        const occurrences = data.explanations.length;
        // Take up to 3 unique explanations as examples.
        const examples = [...new Set(data.explanations)].slice(0, 3);

        const advicePrompt = createReportGenerationPrompt({
          categoryName,
          occurrences,
          explanationSamples: examples,
        });

        const output = await this.gemini.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: advicePrompt,
        });

        const response = output.text;
        const cleanedText = response
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .trim();
        const genResp = JSON.parse(cleanedText);
        const { targeted_advice } = genResp;

        // The returned object now matches the ReportDetailsType structure.
        // 'examples' is converted to a JSON string here.
        return {
          category_name: categoryName,
          occurrences,
          examples: JSON.stringify(examples), // Corrected: Stringify here
          targeted_advice,
        };
      },
    );
  }
}
