import { Report } from '@prisma/client';

export abstract class AbstractReportService {
  abstract createReport(marathonId: string): Promise<Report>;
  abstract findByMarathonId(marathonId: string): Promise<Report>;
}

export const REPORT_SERVICE_TOKEN = 'REPORT_SERVICE_TOKEN';
