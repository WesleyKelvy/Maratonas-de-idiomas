import { apiClient } from "@/lib/api-client";

export interface User {
  id: string;
  name: string;
}

export interface Submission {
  id: string;
  marathon_id: string;
  question_id: number;
  user_id: string;
  answer: string;
  submitted_at: Date;
  corrected_by_ai: boolean;
  corrected_answer: string | null;
  score: number | null;
  user: User; // Included from Prisma query
  AiFeedbacks: AiFeedback[];
}

export interface AiFeedback {
  id: number;
  submissionId: string;
  explanation: string;
  points_deducted: number;
  marathon_id: string;
  category: string;
}

export class SubmissionService {
  static async findAllByMarathonId(marathonId: string): Promise<Submission[]> {
    const response = await apiClient.get<Submission[]>(
      `/submission/marathon/${marathonId}`
    );
    return response;
  }

  static async findAllByUserId(): Promise<Submission[]> {
    const response = await apiClient.get<Submission[]>(`/submission/user`);
    return response;
  }

  static async findOne(id: string): Promise<Submission> {
    const response = await apiClient.get<Submission>(`/submission/${id}`);
    return response;
  }
}
