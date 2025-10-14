import { useQuery } from "@tanstack/react-query";
import {
  SubmissionService,
  Submission,
  DetailedSubmission,
} from "@/services/submission.service";

/**
 * Hook para buscar todas as submissões do usuário logado
 */
export const useUserSubmissions = () => {
  return useQuery({
    queryKey: ["user-submissions"],
    queryFn: SubmissionService.findAllByUserId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para buscar uma submissão específica por ID
 */
export const useSubmissionById = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["submission", id],
    queryFn: () => SubmissionService.findOne(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para buscar todas as submissões de uma maratona específica
 */
export const useMarathonSubmissions = (
  marathonId: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["marathon-submissions", marathonId],
    queryFn: () => SubmissionService.findAllByMarathonId(marathonId),
    enabled: enabled && !!marathonId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook que processa as submissões do usuário para exibição
 */
export const useProcessedUserSubmissions = () => {
  const { data: submissions, isLoading, error } = useUserSubmissions();

  const processedData = submissions
    ? SubmissionService.processSubmissionsForDisplay(submissions)
    : [];

  const stats = submissions
    ? SubmissionService.calculateUserStats(submissions)
    : { totalSubmissions: 0, averageScore: 0, highScoreSubmissions: 0 };

  return {
    submissions: processedData,
    stats,
    isLoading,
    error,
  };
};
