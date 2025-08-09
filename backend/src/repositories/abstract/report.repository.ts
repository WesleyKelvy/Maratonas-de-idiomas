import { Report, Prisma } from '@prisma/client';

export abstract class AbstractReportRepository {
  abstract createReport(data: Prisma.ReportCreateInput): Promise<Report>;
  abstract findByMarathonId(marathonId: string): Promise<Report | null>;
}
