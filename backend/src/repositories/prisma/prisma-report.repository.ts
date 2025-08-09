import { Injectable } from '@nestjs/common';
import { Prisma, Report } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AbstractReportRepository } from 'src/repositories/abstract/report.repository';

@Injectable()
export class PrismaReportRepository implements AbstractReportRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createReport(data: Prisma.ReportCreateInput): Promise<Report> {
    return this.prisma.report.create({
      data,
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
