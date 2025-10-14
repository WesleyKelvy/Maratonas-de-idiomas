import { apiClient } from "@/lib/api-client";

export interface User {
  id: string;
  name: string;
}

export interface Question {
  id: number;
  title: string | null;
  prompt_text: string;
}

export interface Marathon {
  id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  code: string;
}

export interface DetailedUser {
  id: string;
  name: string;
  email: string;
}

export interface AiFeedback {
  id: number;
  submissionId: string;
  explanation: string;
  points_deducted: number;
  marathon_id: string;
  category: string;
}

export interface DetailedAiFeedback {
  id: number;
  category: string;
  explanation: string;
  points_deducted: number;
}

export interface Submission {
  id: string;
  marathon_id: string;
  question_id: number;
  user_id: string;
  answer: string;
  submitted_at: string;
  corrected_by_ai: boolean;
  corrected_answer: string | null;
  score: number | null;
  user?: User;
  marathon?: Marathon;
  question?: Question;
  AiFeedbacks?: AiFeedback[];
}

export interface DetailedSubmission {
  id: string;
  marathon_id: string;
  question_id: number;
  answer: string;
  submitted_at: string;
  corrected_by_ai: boolean;
  corrected_answer: string | null;
  score: number;
  marathon: {
    title: string;
  };
  question: {
    title: string;
  };
}

export interface SubmissionDetailsResponse {
  id: string;
  marathon_id: string;
  question_id: number;
  answer: string;
  submitted_at: string;
  corrected_by_ai: boolean;
  corrected_answer: string | null;
  score: number;
  marathon: {
    title: string;
  };
  question: {
    title: string;
    prompt_text: string;
  };
  user: {
    name: string;
    email: string;
  };
  AiFeedbacks: AiFeedback[];
}

export interface SubmissionWithDetails extends DetailedSubmission {
  marathonName: string;
  questionNumber: number;
  totalScore: number;
  percentage: number;
  aiEvaluation: string;
}

export class SubmissionService {
  /**
   * Buscar todas as submissões do usuário logado
   */
  static async findAllByUserId(): Promise<DetailedSubmission[]> {
    const response = await apiClient.get<DetailedSubmission[]>(
      "/submission/user/get-my-submissions"
    );
    return response;
  }

  /**
   * Buscar submissão por ID
   */
  static async findOne(id: string): Promise<SubmissionDetailsResponse> {
    const response = await apiClient.get<SubmissionDetailsResponse>(
      `/submission/${id}`
    );
    return response;
  }

  /**
   * Buscar todas as submissões de uma maratona específica
   */
  static async findAllByMarathonId(marathonId: string): Promise<Submission[]> {
    const response = await apiClient.get<Submission[]>(
      `/submission/marathon/${marathonId}`
    );
    return response;
  }

  /**
   * Processar dados das submissões para exibição
   */
  static processSubmissionsForDisplay(
    submissions: DetailedSubmission[]
  ): SubmissionWithDetails[] {
    return submissions.map((submission) => {
      // Como agora não temos AiFeedbacks na resposta inicial, usaremos apenas o score
      const totalScore = submission.score;
      const percentage = totalScore;

      // Determinar avaliação da IA baseada na pontuação
      let aiEvaluation = "Neutra";
      if (percentage >= 80) aiEvaluation = "Positiva";
      else if (percentage < 50) aiEvaluation = "Negativa";

      // O feedback detalhado será buscado separadamente quando necessário
      const detailedFeedback: {
        explanation: string;
        pointsDeducted: number;
        category: string;
        suggestions: string[];
      }[] = [];

      // Usar os títulos que vêm da API
      const marathonName = submission.marathon.title;

      return {
        ...submission,
        marathonName,
        questionNumber: submission.question_id,
        totalScore,
        percentage,
        aiEvaluation,
        detailedFeedback,
      };
    });
  }

  /**
   * Calcular estatísticas das submissões do usuário
   */
  static calculateUserStats(submissions: DetailedSubmission[]) {
    const totalSubmissions = submissions.length;

    if (totalSubmissions === 0) {
      return {
        totalSubmissions: 0,
        averageScore: 0,
        highScoreSubmissions: 0,
      };
    }

    const processedSubmissions = this.processSubmissionsForDisplay(submissions);

    const averageScore =
      processedSubmissions.reduce((acc, sub) => {
        return acc + sub.percentage / 100;
      }, 0) / totalSubmissions;

    const highScoreSubmissions = processedSubmissions.filter((sub) => {
      return sub.percentage >= 80;
    }).length;

    return {
      totalSubmissions,
      averageScore,
      highScoreSubmissions,
    };
  }
}
