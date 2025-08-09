import { ReportDetails } from '@prisma/client';

export type CreateReport = {
  classroom_code: string;
  marathon_id: string;
  total_errors: number;
  report_details: ReportDetails[];
};
