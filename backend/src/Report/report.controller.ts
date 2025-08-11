import {
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Report } from '@prisma/client';
import { ProfessorGuard } from 'src/auth/guards/professor.guard';
import {
  AbstractReportService,
  REPORT_SERVICE_TOKEN,
} from 'src/Report/abstract-services/abstract-report.service';

@UseGuards(ProfessorGuard)
@Controller('marathon/:marathonId/report')
export class ReportController {
  constructor(
    @Inject(REPORT_SERVICE_TOKEN)
    private readonly reportService: AbstractReportService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createReport(@Param('marathonId') marathonId: string): Promise<Report> {
    return this.reportService.createReport(marathonId);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async getReport(@Param('marathonId') marathonId: string): Promise<Report> {
    return this.reportService.findByMarathonId(marathonId);
  }
}
