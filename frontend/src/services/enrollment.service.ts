import { apiClient } from "@/lib/api-client";

export interface Enrollment {
  id: string;
  user_id: string;
  marathon_id: string;
  marathon_code: string;
  created_at: Date;
}

export class EnrollmentService {
  static async findAllEnrollmentsByMarathonId(
    marathonId: string
  ): Promise<Enrollment[]> {
    // Baseado no controller, este endpoint seria algo assim:
    const response = await apiClient.get<Enrollment[]>(
      `/enrollment/marathon/${marathonId}`
    );
    return response;
  }

  static async findAllByUserId(): Promise<Enrollment[]> {
    const response = await apiClient.get<Enrollment[]>(`/enrollment/user`);
    return response;
  }
}
