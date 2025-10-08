import {
  Controller,
  Get,
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
import { CreateReportDto } from 'src/Report/dto/report.create.dto';

// Replaced by the WebSocket implementation -----------------------//
@UseGuards(RolesGuard)
@Roles(Role.Professor)
@Controller('/report/marathon/:marathonId')
export class ReportController {
  constructor(
    @Inject(REPORT_SERVICE_TOKEN)
    private readonly reportService: AbstractReportService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async createReport(
    @Param('marathonId') { marathonId }: CreateReportDto,
  ): Promise<Report> {
    return this.reportService.createReport(marathonId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getReport(@Param('marathonId') marathonId: string) {
    return this.reportService.findByMarathonId(marathonId);
  }
}
