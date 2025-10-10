import { useQuery } from "@tanstack/react-query";
import { SubmissionService } from "@/services/submission.service";

export function useSubmissionDetails(submissionId: string) {
  return useQuery({
    queryKey: ["submission", submissionId],
    queryFn: () => SubmissionService.findOne(submissionId),
    enabled: !!submissionId,
  });
}
