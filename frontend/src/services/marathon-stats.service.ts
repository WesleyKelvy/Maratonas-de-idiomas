import { apiClient } from "@/lib/api-client";

export interface MarathonStats {
  totalEnrollments: number;
  totalSubmissions: number;
  averageScore: number;
  completionRate: number;
  topScorer: {
    name: string;
    score: number;
  };
}

export interface StudentProgress {
  id: string;
  name: string;
  email: string;
  questionsAnswered: number;
  totalQuestions: number;
  averageScore: number;
  lastSubmission: string;
  status: "completed" | "in-progress" | "not-started";
}

export interface QuestionStats {
  id: number;
  title: string;
  totalSubmissions: number;
  averageScore: number;
  difficulty: "Fácil" | "Médio" | "Difícil";
}

export interface EnrollmentData {
  id: string;
  user_id: string;
  marathon_id: string;
  enrolled_at: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface SubmissionData {
  id: string;
  marathon_id: string;
  question_id: number;
  user_id: string;
  answer: string;
  submitted_at: string;
  score: number;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  question?: {
    id: number;
    title: string;
  };
}

export class MarathonStatsService {
  /**
   * Buscar todas as inscrições de uma maratona
   */
  static async getMarathonEnrollments(
    marathonId: string
  ): Promise<EnrollmentData[]> {
    return apiClient.get<EnrollmentData[]>(
      `/enrollment/marathon/${marathonId}`
    );
  }

  /**
   * Buscar todas as submissões de uma maratona
   */
  static async getMarathonSubmissions(
    marathonId: string
  ): Promise<SubmissionData[]> {
    return apiClient.get<SubmissionData[]>(
      `/submission/marathon/${marathonId}`
    );
  }

  /**
   * Calcular estatísticas da maratona baseado nos dados de inscrições e submissões
   */
  static calculateMarathonStats(
    enrollments: EnrollmentData[],
    submissions: SubmissionData[],
    totalQuestions: number
  ): MarathonStats {
    const totalEnrollments = enrollments.length;
    const totalSubmissions = submissions.length;

    // Calcular média geral das pontuações
    const averageScore =
      submissions.length > 0
        ? submissions.reduce((sum, sub) => sum + (sub.score || 0), 0) /
          submissions.length
        : 0;

    // Calcular taxa de conclusão
    const usersWithSubmissions = new Set(submissions.map((s) => s.user_id));
    const completionRate =
      totalEnrollments > 0
        ? (usersWithSubmissions.size / totalEnrollments) * 100
        : 0;

    // Encontrar melhor pontuação
    const userScores = new Map<
      string,
      { name: string; totalScore: number; count: number }
    >();

    submissions.forEach((submission) => {
      const userId = submission.user_id;
      const userName = submission.user?.name || "Usuário Desconhecido";
      const score = submission.score || 0;

      if (!userScores.has(userId)) {
        userScores.set(userId, { name: userName, totalScore: 0, count: 0 });
      }

      const userStats = userScores.get(userId)!;
      userStats.totalScore += score;
      userStats.count += 1;
    });

    let topScorer = { name: "Nenhum", score: 0 };
    let highestAverage = 0;

    userScores.forEach((userStats) => {
      const average = userStats.totalScore / userStats.count;
      if (average > highestAverage) {
        highestAverage = average;
        topScorer = { name: userStats.name, score: average };
      }
    });

    return {
      totalEnrollments,
      totalSubmissions,
      averageScore: Math.round(averageScore * 100) / 100,
      completionRate: Math.round(completionRate * 100) / 100,
      topScorer: {
        name: topScorer.name,
        score: Math.round(topScorer.score * 100) / 100,
      },
    };
  }

  /**
   * Calcular progresso dos estudantes
   */
  static calculateStudentProgress(
    enrollments: EnrollmentData[],
    submissions: SubmissionData[],
    totalQuestions: number
  ): StudentProgress[] {
    return enrollments.map((enrollment) => {
      const userSubmissions = submissions.filter(
        (sub) => sub.user_id === enrollment.user_id
      );
      const questionsAnswered = new Set(
        userSubmissions.map((sub) => sub.question_id)
      ).size;

      const averageScore =
        userSubmissions.length > 0
          ? userSubmissions.reduce((sum, sub) => sum + (sub.score || 0), 0) /
            userSubmissions.length
          : 0;

      const lastSubmissionDate =
        userSubmissions.length > 0
          ? Math.max(
              ...userSubmissions.map((sub) =>
                new Date(sub.submitted_at).getTime()
              )
            )
          : 0;

      const lastSubmission =
        lastSubmissionDate > 0
          ? new Date(lastSubmissionDate).toISOString()
          : "";

      let status: "completed" | "in-progress" | "not-started" = "not-started";
      if (questionsAnswered === totalQuestions) {
        status = "completed";
      } else if (questionsAnswered > 0) {
        status = "in-progress";
      }

      return {
        id: enrollment.user_id,
        name: enrollment.user?.name || "Usuário Desconhecido",
        email: enrollment.user?.email || "Email não disponível",
        questionsAnswered,
        totalQuestions,
        averageScore: Math.round(averageScore * 100) / 100,
        lastSubmission,
        status,
      };
    });
  }

  /**
   * Calcular estatísticas por questão
   */
  static calculateQuestionStats(
    submissions: SubmissionData[],
    questions: Array<{ id: number; title: string }>
  ): QuestionStats[] {
    return questions.map((question) => {
      const questionSubmissions = submissions.filter(
        (sub) => sub.question_id === question.id
      );
      const totalSubmissions = questionSubmissions.length;

      const averageScore =
        totalSubmissions > 0
          ? questionSubmissions.reduce(
              (sum, sub) => sum + (sub.score || 0),
              0
            ) / totalSubmissions
          : 0;

      // Determinar dificuldade baseada na média de pontuação
      let difficulty: "Fácil" | "Médio" | "Difícil" = "Médio";
      if (averageScore >= 80) difficulty = "Fácil";
      else if (averageScore <= 60) difficulty = "Difícil";

      return {
        id: question.id,
        title: question.title,
        totalSubmissions,
        averageScore: Math.round(averageScore * 100) / 100,
        difficulty,
      };
    });
  }
}
