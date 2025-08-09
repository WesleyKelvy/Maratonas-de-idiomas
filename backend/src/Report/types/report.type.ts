import { ReportDetailsType } from 'src/Report/types/reportDetails.type';

export type ReportType = {
  report: {
    total_errors: number;
    categories: ReportDetailsType[];
  };
};
