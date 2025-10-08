import { apiClient } from "@/lib/api-client";

export interface Report {
  id: string;
  classroom_name: string;
  marathon_id: string;
  total_errors: number;
  created_at: Date;
  report_details?: ReportDetail[];
}

export interface ReportDetail {
  id: number;
  report_id: string;
  occurrences: number;
  category_name: string;
  examples: string;
  targeted_advice: string;
}

export interface CreateReportRequest {
  marathonId: string;
}

export class ReportService {
  static async findByMarathonId(marathonId: string): Promise<Report> {
    return await apiClient.get<Report>(`/report/marathon/${marathonId}`);
  }

  static async createReport(marathonId: string): Promise<Report> {
    return await apiClient.post<Report>(`/report/marathon/${marathonId}`);
  }
}
