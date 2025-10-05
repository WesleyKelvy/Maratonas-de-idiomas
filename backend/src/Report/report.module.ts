import { GoogleGenAI } from '@google/genai';
import { Inject, Module } from '@nestjs/common';
import { AiFeedbackModule } from 'src/AiFeedback/aiFeedback.module';
import { ProfessorGuard } from 'src/auth/guards/professor.guard';
import { ClassroomModule } from 'src/Classroom/classroom.module';
import { REPORT_SERVICE_TOKEN } from 'src/Report/abstract-services/abstract-report.service';
import { ReportGateway } from 'src/Report/gateway/report.gateway';
import { ReportController } from 'src/Report/report.controller';
import { ReportService } from 'src/Report/report.service';
import { REPORT_REPOSITORY_TOKEN } from 'src/repositories/abstract/report.repository';
import { PrismaReportRepository } from 'src/repositories/prisma/prisma-report.repository';

@Module({
  imports: [ClassroomModule, AiFeedbackModule],
  controllers: [ReportController],
  providers: [
    ReportGateway,
    {
      provide: REPORT_SERVICE_TOKEN,
      useClass: ReportService,
    },
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
    @Inject(REPORT_SERVICE_TOKEN) private readonly reportService: ReportService,
    private readonly reportGateway: ReportGateway,
  ) {
    // Inject the gateway to avoid circular dependetion
    this.reportService.setReportGateway(this.reportGateway);
  }
}
