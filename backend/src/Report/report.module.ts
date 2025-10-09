import { GoogleGenAI } from '@google/genai';
import { Inject, Module } from '@nestjs/common';
import { AiFeedbackModule } from 'src/AiFeedback/aiFeedback.module';
import { AuthModule } from 'src/auth/auth.module';
import { ProfessorGuard } from 'src/auth/guards/professor.guard';
import { ClassroomModule } from 'src/Classroom/classroom.module';
import { REPORT_REPOSITORY_TOKEN } from 'src/repositories/abstract/report.repository';
import { PrismaReportRepository } from 'src/repositories/prisma/prisma-report.repository';
import {
  AbstractReportService,
  REPORT_SERVICE_TOKEN,
} from './abstract-services/abstract-report.service';
import { ReportGateway } from './gateway/report.gateway';
import { MockReportService } from './mock-report.service';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

// 2. Criado um provider condicional para alternar entre o serviço real e o mock
const reportServiceProvider = {
  provide: REPORT_SERVICE_TOKEN,
  useClass:
    process.env.NODE_ENV === 'development' ? MockReportService : ReportService,
};

@Module({
  imports: [ClassroomModule, AiFeedbackModule, AuthModule],
  controllers: [ReportController],
  providers: [
    ReportGateway,
    reportServiceProvider,
    {
      provide: REPORT_REPOSITORY_TOKEN,
      useClass: PrismaReportRepository,
    },
    ProfessorGuard,
    {
      provide: GoogleGenAI,
      useFactory: () => {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
          throw new Error('GEMINI_API_KEY not set');
        }
        return new GoogleGenAI({ apiKey });
      },
    },
  ],
  exports: [REPORT_SERVICE_TOKEN, ReportGateway],
})
export class ReportModule {
  constructor(
    // 3. O tipo injetado agora é a classe abstrata para permitir a flexibilidade
    @Inject(REPORT_SERVICE_TOKEN)
    private readonly reportService: AbstractReportService,
    private readonly reportGateway: ReportGateway,
  ) {
    // A injeção do gateway funciona para ambas as implementações (real e mock)
    this.reportService.setReportGateway(this.reportGateway);
  }
}
