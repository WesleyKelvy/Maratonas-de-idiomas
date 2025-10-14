import { apiClient } from "@/lib/api-client";

export interface AiFeedbackDetail {
  id: number;
  submissionId: string;
  explanation: string;
  points_deducted: number;
  marathon_id: string;
  category: string;
}
export class AiFeedbackService {
  /**
   * Buscar todos os feedbacks de uma submissão específica
   */
  static async findAllBySubmissionId(
    submissionId: string
  ): Promise<AiFeedbackDetail[]> {
    console.log("🔍 Buscando feedback para submissionId:", submissionId);

    const response = await apiClient.get<AiFeedbackDetail[]>(
      `/submission/${submissionId}/ai-feedback`
    );

    console.log("✅ Feedback recebido:", response);
    console.log("📊 Quantidade de feedbacks:", response?.length ?? 0);

    return response;
  }
}
