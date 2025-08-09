import {
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  AbstractReportService,
  REPORT_SERVICE_TOKEN,
} from 'src/Report/abstract-services/abstract-report.service';
import { StudentGuard } from '../auth/guards/student.guard';
import { Report } from '@prisma/client';

@UseGuards(StudentGuard)
@Controller('marathon/:marathonId/report')
export class AiFeedbackController {
  constructor(
    @Inject(REPORT_SERVICE_TOKEN)
    private readonly reportService: AbstractReportService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async createReport(@Param('marathonId') submissionId: string): Promise<void> {
    return this.reportService.createReport(submissionId);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async getReport(@Param('marathonId') marathonId: string): Promise<Report> {
    return this.reportService.findByMarathonId(marathonId);
  }
}
