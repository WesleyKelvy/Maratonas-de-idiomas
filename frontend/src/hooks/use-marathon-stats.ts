import { useQuery } from "@tanstack/react-query";
import { MarathonStatsService } from "@/services/marathon-stats.service";
import { MarathonService } from "@/services/marathon.service";

/**
 * Hook para buscar estatísticas completas de uma maratona
 */
export const useMarathonStats = (marathonId: string) => {
  return useQuery({
    queryKey: ["marathon-stats", marathonId],
    queryFn: async () => {
      // Buscar dados da maratona
      const marathon = await MarathonService.findOneWithQuestions(marathonId);

      // Buscar inscrições e submissões
      const [enrollments, submissions] = await Promise.all([
        MarathonStatsService.getMarathonEnrollments(marathonId),
        MarathonStatsService.getMarathonSubmissions(marathonId),
      ]);

      // Calcular estatísticas
      const stats = MarathonStatsService.calculateMarathonStats(
        enrollments,
        submissions,
        marathon.number_of_questions
      );

      const studentsProgress = MarathonStatsService.calculateStudentProgress(
        enrollments,
        submissions,
        marathon.number_of_questions
      );

      const questionsStats = MarathonStatsService.calculateQuestionStats(
        submissions,
        marathon.questions || []
      );

      return {
        marathon,
        stats,
        studentsProgress,
        questionsStats,
        enrollments,
        submissions,
      };
    },
    enabled: !!marathonId,
    staleTime: 2 * 60 * 1000, // 2 minutos
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook para buscar apenas as inscrições de uma maratona
 */
export const useMarathonEnrollments = (marathonId: string) => {
  return useQuery({
    queryKey: ["marathon-enrollments", marathonId],
    queryFn: () => MarathonStatsService.getMarathonEnrollments(marathonId),
    enabled: !!marathonId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook para buscar apenas as submissões de uma maratona
 */
export const useMarathonSubmissions = (marathonId: string) => {
  return useQuery({
    queryKey: ["marathon-submissions", marathonId],
    queryFn: () => MarathonStatsService.getMarathonSubmissions(marathonId),
    enabled: !!marathonId,
    staleTime: 3 * 60 * 1000, // 3 minutos
    refetchOnWindowFocus: false,
  });
};
