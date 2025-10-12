import { apiClient } from "@/lib/api-client";

export interface Question {
  id: number;
  marathonId: string;
  title: string;
  prompt_text: string;
  orderNumber: number;
}

export interface CreateQuestionRequest {
  title: string;
  prompt_text: string;
}

export interface UpdateQuestionRequest {
  title?: string;
  prompt_text?: string;
}

export interface GeminiQuestionResponse {
  question_text: string;
}

export interface SaveQuestionsRequest {
  title: string;
  prompt_text: string;
}

export class QuestionService {
  private static readonly BASE_URL = "/questions";

  // GET /questions/:id - findOne
  static async findOne(id: number): Promise<Question> {
    return apiClient.get<Question>(`${QuestionService.BASE_URL}/${id}`);
  }

  // GET /questions/marathon/:marathonId - findAllByMarathonId
  static async findAllByMarathonId(marathonId: string): Promise<Question[]> {
    return apiClient.get<Question[]>(
      `${QuestionService.BASE_URL}/marathon/${marathonId}`
    );
  }

  // POST /questions/create-questions - getGeminiQuestions
  static async generateQuestionsWithGemini(
    marathonId: string
  ): Promise<GeminiQuestionResponse[]> {
    return apiClient.post<GeminiQuestionResponse[]>(
      `${QuestionService.BASE_URL}/${marathonId}/create-questions`,
      {}
    );
  }

  // POST /questions/save-questions - saveQuestions
  static async saveQuestions(
    marathonId: string,
    data: SaveQuestionsRequest[]
  ): Promise<Question[]> {
    return apiClient.post<Question[]>(
      `${QuestionService.BASE_URL}/${marathonId}/save-questions`,
      data
    );
  }

  // PATCH /questions/:id - update
  static async update(
    id: number,
    data: UpdateQuestionRequest
  ): Promise<Question> {
    return apiClient.patch<Question>(`${QuestionService.BASE_URL}/${id}`, data);
  }

  // DELETE /questions/:id - remove
  static async remove(id: number): Promise<void> {
    return apiClient.delete<void>(`${QuestionService.BASE_URL}/${id}`);
  }
}
