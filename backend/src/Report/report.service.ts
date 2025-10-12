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
import {
  AbstractLanguageMarathonService,
  LANGUAGE_MARATHON_SERVICE_TOKEN,
} from 'src/LanguageMarathon/abstract-services/abstract-language-marathon.service';
import { AbstractReportService } from 'src/Report/abstract-services/abstract-report.service';
import { createReportGenerationPrompt } from 'src/Report/ai/createReportGenerationPrompt';
import { ReportGateway } from 'src/Report/gateway/report.gateway';
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
  // Gateway is being injected by the module to avoid circular dependention
  private reportGateway: ReportGateway;

  constructor(
    @Inject(LANGUAGE_MARATHON_SERVICE_TOKEN)
    private readonly marathonService: AbstractLanguageMarathonService,
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

  setReportGateway(gateway: ReportGateway) {
    this.reportGateway = gateway;
  }

  async findByMarathonId(marathonId: string): Promise<Report> {
    const report = await this.reportRepository.findByMarathonId(marathonId);
    if (!report) {
      throw new HttpException('Report not found.', HttpStatus.NOT_FOUND);
    }
    return report;
  }

  async createReport(marathonId: string): Promise<Report> {
    try {
      const marathon = await this.marathonService.findOneById(marathonId);

      if (!marathon) {
        throw new HttpException('Marathon not found.', HttpStatus.NOT_FOUND);
      }

      const now = new Date();
      const endDate = new Date(marathon.end_date);

      if (isNaN(endDate.getTime())) {
        throw new HttpException(
          'Invalid marathon end date.',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (now < endDate) {
        throw new HttpException(
          'Wait until the marathon finishes.',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }

      const reportOnDb = this.findByMarathonId(marathonId);

      if (reportOnDb) {
        throw new HttpException(
          'This marathon already has a report.',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }

      // Progress: 10%
      this._emitProgress(
        marathonId,
        10,
        'Buscando dados da turma e feedbacks...',
      );

      const [classroom, aiFeedbacks] = await Promise.all([
        this.classroomService.findClassroomByMarathonId(marathonId),
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

      // Progress: 20%
      this._emitProgress(
        marathonId,
        20,
        'Dados carregados. Processando feedbacks...',
      );

      const dataToCreateFinalReport: FinalReportData[] = aiFeedbacks.map(
        ({ explanation, category }) => ({ explanation, category }),
      );

      // Progress: 30%
      this._emitProgress(marathonId, 30, 'Gerando análises com IA...');

      const { report } = await this._createFinalReport(
        marathonId,
        dataToCreateFinalReport,
      );

      // Progress: 90%
      this._emitProgress(marathonId, 90, 'Salvando relatório...');

      const reportData: CreateReport = {
        classroom_name: classroom.name,
        marathon_id: marathonId,
        total_errors: report.total_errors,
        report_details: {
          create: report.categories.map((category) => ({
            category_name: category.category_name,
            occurrences: category.occurrences,
            examples: category.examples,
            targeted_advice: category.targeted_advice,
          })),
        },
      };

      const savedReport = await this.reportRepository.createReport(reportData);

      // Progress: 100%
      this._emitProgress(marathonId, 100, 'Relatório concluído!');

      return savedReport;
    } catch (error) {
      console.error(`Error creating report for marathon ${marathonId}:`, error);
      throw error;
    }
  }

  private async _createFinalReport(
    marathonId: string,
    errors: FinalReportData[],
  ): Promise<ReportType> {
    try {
      const total_errors = errors.length;

      // Progress: 40%
      this._emitProgress(marathonId, 40, 'Agrupando erros por categoria...');

      // Step 1: Group explanations by category
      const categoryMap = new Map<string, { explanations: string[] }>();
      for (const error of errors) {
        if (!categoryMap.has(error.category)) {
          categoryMap.set(error.category, { explanations: [] });
        }
        categoryMap.get(error.category).explanations.push(error.explanation);
      }

      // Progress: 50%
      this._emitProgress(
        marathonId,
        50,
        `Gerando conselhos para ${categoryMap.size} categorias...`,
      );

      // Step 2: Create promises for each category
      const reportCategoryPromises = this._generateAdvicePromises(categoryMap);

      // Progress: 60% - 80%
      const totalCategories = categoryMap.size;
      let completedCategories = 0;

      // Step 3: Execute all advice generation promises in parallel
      const reportCategories = await Promise.all(
        reportCategoryPromises.map(async (promise) => {
          const result = await promise;
          completedCategories++;
          const progress =
            60 + Math.floor((completedCategories / totalCategories) * 20);
          this._emitProgress(
            marathonId,
            progress,
            `Processando categoria ${completedCategories}/${totalCategories}...`,
          );
          return result;
        }),
      );

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
        // Take up to 3 unique explanations as examples
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

        // Return object matches ReportDetailsType structure
        return {
          category_name: categoryName,
          occurrences,
          examples: JSON.stringify(examples), // Convert to string as per type
          targeted_advice,
        };
      },
    );
  }

  // Helper to emit Progress
  private _emitProgress(
    marathonId: string,
    progress: number,
    message?: string,
  ) {
    if (this.reportGateway) {
      this.reportGateway.emitReportProgress(marathonId, progress, message);
    }
  }
}
