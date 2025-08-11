import { Report } from '@prisma/client';
import { CreateReport } from 'src/Report/types/createReport.type';

export abstract class AbstractReportRepository {
  abstract createReport(data: CreateReport): Promise<Report>;
  abstract findByMarathonId(marathonId: string): Promise<Report | null>;
}

export const REPORT_REPOSITORY_TOKEN = 'REPORT_REPOSITORY_TOKEN';
