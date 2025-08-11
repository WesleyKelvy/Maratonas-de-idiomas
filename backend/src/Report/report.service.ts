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
import { createClassificationPrompt } from 'src/Report/ai/createClassificationPrompt';
import { createReportGenerationPrompt } from 'src/Report/ai/createReportGenerationPrompt';
import { CreateReport } from 'src/Report/types/createReport.type';
import { ReportType } from 'src/Report/types/report.type';
import {
  AbstractReportRepository,
  REPORT_REPOSITORY_TOKEN,
} from 'src/repositories/abstract/report.repository';

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
    const classroom =
      await this.classroomService.findOneByMarathonId(marathonId);

    if (!classroom) {
      throw new HttpException(
        'Classroom not found for the given marathon.',
        HttpStatus.NOT_FOUND,
      );
    }

    const aiFeedbacks =
      await this.aiFeedbackService.findAllByMarathonId(marathonId);

    if (aiFeedbacks.length === 0) {
      throw new HttpException(
        'No feedback available to generate a report.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const explanations: string[] = aiFeedbacks.map(
      ({ explanation }) => explanation,
    );

    const { report } = await this.createFinalReport(explanations);

    const reportData: CreateReport = {
      classroom_code: classroom.code,
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

  async createFinalReport(explanations: string[]): Promise<ReportType> {
    try {
      const total_errors = explanations.length;
      const categoryMap = await this.processErrors(explanations);

      const reportCategories = [];

      for (const [categoryName, data] of categoryMap.entries()) {
        const occurrences = data.explanations.length;
        // Take the first 3 unique explanations as examples
        const examples = [...new Set(data.explanations)].slice(0, 3);

        // Call the AI to get advice for this specific category (Step 3)
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

        // parse into the wrapper
        const genResp = JSON.parse(cleanedText);
        const { targeted_advice } = genResp;

        reportCategories.push({
          category_name: categoryName,
          occurrences,
          examples,
          targeted_advice,
        });
      }

      return {
        report: {
          total_errors,
          categories: reportCategories,
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async processErrors(explanations: string[]) {
    try {
      const categoryMap = new Map();

      for (const explanation of explanations) {
        // This can be parallelized for speed
        const output = await this.gemini.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: createClassificationPrompt(explanation),
        });

        const category = output.text;

        if (!categoryMap.has(category)) {
          categoryMap.set(category, { explanations: [] });
        }
        categoryMap.get(category).explanations.push(explanation);
      }
      return categoryMap;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
