import { ReportDetails } from '@prisma/client';

export class Report {
  id: string;
  classrrom_code: string;
  marathon_id: string;
  total_errors: number;
  report_details: ReportDetails;
}
