import {
  AiFeedbackService
} from "@/services/aiFeedback.service";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook para buscar feedback de IA de uma submissão específica
 */
export const useAiFeedbackBySubmissionId = (
  submissionId: string | undefined,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["ai-feedback", submissionId],
    queryFn: () => {
      if (!submissionId) {
        throw new Error("Submission ID is required");
      }
      return AiFeedbackService.findAllBySubmissionId(submissionId);
    },
    enabled: enabled && !!submissionId,
    staleTime: 5 * 60 * 1000,
    initialData: undefined,
  });
};
