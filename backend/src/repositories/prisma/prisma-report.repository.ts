import { Injectable } from '@nestjs/common';
import { Report } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReport } from 'src/Report/types/createReport.type';
import { AbstractReportRepository } from 'src/repositories/abstract/report.repository';

@Injectable()
export class PrismaReportRepository implements AbstractReportRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createReport(dto: CreateReport): Promise<Report> {
    return this.prisma.report.create({
      data: {
        classroom_name: dto.classroom_name,
        total_errors: dto.total_errors,
        report_details: dto.report_details,
        marathon: { connect: { id: dto.marathon_id } },
      },
      include: {
        report_details: true, // Include the details in the returned object
      },
    });
  }

  async findByMarathonId(marathonId: string): Promise<Report | null> {
    return this.prisma.report.findFirst({
      where: { marathon_id: marathonId },
      include: {
        report_details: true,
      },
    });
  }
}
