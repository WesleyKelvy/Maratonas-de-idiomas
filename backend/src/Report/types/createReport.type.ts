import { ReportDetailsType } from 'src/Report/types/reportDetails.type';

export type CreateReport = {
  classroom_name: string;
  marathon_id: string;
  total_errors: number;
  report_details: {
    create: ReportDetailsType[];
  };
};
