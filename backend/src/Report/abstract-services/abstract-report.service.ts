import { Report } from '@prisma/client';
import { ReportGateway } from '../gateway/report.gateway';

export abstract class AbstractReportService {
  abstract createReport(marathonId: string): Promise<Report>;
  abstract findByMarathonId(marathonId: string): Promise<Report>;
  abstract setReportGateway(gateway: ReportGateway): void;
}

export const REPORT_SERVICE_TOKEN = 'REPORT_SERVICE_TOKEN';
