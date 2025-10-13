import { apiClient } from "@/lib/api-client";
import { LanguageMarathon } from "./marathon.service";

export interface Enrollment {
  id: string;
  userId: string;
  marathonId: string;
}

export interface EnrollmentWithMarathons {
  id: string;
  marathon: {
    id: string;
    title: string;
    description: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    start_date: Date;
    end_date: Date | null;
    number_of_questions: number;
    timeLimit: number;
    code: string;
  };
}

export interface CreateEnrollmentRequest {
  code: string;
}

export class EnrollmentService {
  static async createEnrollment(
    data: CreateEnrollmentRequest
  ): Promise<Enrollment> {
    const response = await apiClient.post<Enrollment>(
      "/enrollment/create",
      data
    );
    return response;
  }

  static async findAllEnrollmentsByMarathonId(
    marathonId: string
  ): Promise<Enrollment[]> {
    const response = await apiClient.get<Enrollment[]>(
      `/enrollment/marathon/${marathonId}`
    );
    return response;
  }

  static async findAllByUserId(): Promise<EnrollmentWithMarathons[]> {
    const response = await apiClient.get<EnrollmentWithMarathons[]>(
      `/enrollment/user`
    );
    return response;
  }
}
