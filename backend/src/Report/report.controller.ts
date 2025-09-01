import {
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Report, Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import {
  AbstractReportService,
  REPORT_SERVICE_TOKEN,
} from 'src/Report/abstract-services/abstract-report.service';

@UseGuards(RolesGuard)
@Roles(Role.Professor)
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
