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
    if (!process.env.GEMINI_API_KEY) {
      console.error('[Report Service] GEMINI_API_KEY not configured');
      throw new Error('GEMINI_API_KEY is not configured');
    }

    try {
      this.gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      console.log('[Report Service] Google GenAI initialized successfully');
    } catch (error) {
      console.error(
        '[Report Service] Failed to initialize Google GenAI:',
        error,
      );
      throw error;
    }
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

  async findByMarathonIdOrNull(marathonId: string): Promise<Report | null> {
    return await this.reportRepository.findByMarathonId(marathonId);
  }

  async createReport(marathonId: string): Promise<Report> {
    try {
      console.log(
        `[Report] Starting report creation for marathon ${marathonId}`,
      );

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

      const reportOnDb = await this.findByMarathonIdOrNull(marathonId);
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
      console.error(
        `[Report] Error creating report for marathon ${marathonId}:`,
        error,
      );

      // Emit error progress
      this._emitProgress(marathonId, 0, `Erro: ${error.message}`);

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
      console.error('[Report] Error in createFinalReport:', error);
      throw new HttpException(
        `Failed to generate report: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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

        // Retry logic for API calls
        const maxRetries = 5;
        let lastError: Error;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            console.log(
              `[Report] API call attempt ${attempt}/${maxRetries} for ${categoryName}`,
            );

            const output = await this.gemini.models.generateContent({
              model: 'gemini-2.0-flash-exp',
              contents: advicePrompt,
            });

            const response = output.text;
            const cleanedText = response
              .replace(/```json/g, '')
              .replace(/```/g, '')
              .trim();

            const genResp = JSON.parse(cleanedText);
            const { targeted_advice } = genResp;

            console.log(
              `[Report] Successfully generated advice for ${categoryName}`,
            );

            // Return object matches ReportDetailsType structure
            return {
              category_name: categoryName,
              occurrences,
              examples: JSON.stringify(examples), // Convert to string as per type
              targeted_advice,
            };
          } catch (error) {
            lastError = error;
            console.error(
              `[Report] Attempt ${attempt}/${maxRetries} failed for ${categoryName}:`,
              error.message,
            );

            // Wait before retrying (exponential backoff)
            if (attempt < maxRetries) {
              const waitTime = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
              console.log(`[Report] Waiting ${waitTime}ms before retry...`);
              await new Promise((resolve) => setTimeout(resolve, waitTime));
            }
          }
        }

        // If all retries failed
        console.error(
          `[Report] All retry attempts failed for ${categoryName}. Error:`,
          lastError,
        );
        throw new HttpException(
          `Failed to generate advice for category "${categoryName}" after ${maxRetries} attempts: ${lastError.message}`,
          HttpStatus.SERVICE_UNAVAILABLE,
        );
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
