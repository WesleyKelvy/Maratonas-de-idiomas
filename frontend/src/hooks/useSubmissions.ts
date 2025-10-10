import { useQuery } from "@tanstack/react-query";
import { EnrollmentService } from "@/services/enrollment.service";
import { UserService } from "@/services/user.service";
import { SubmissionService } from "@/services/submission.service";

export function useEnrollmentsByMarathon(marathonId: string) {
  return useQuery({
    queryKey: ["enrollments", "marathon", marathonId],
    queryFn: () => EnrollmentService.findAllEnrollmentsByMarathonId(marathonId),
    enabled: !!marathonId,
  });
}

export function useUsersByIds(userIds: string[]) {
  return useQuery({
    queryKey: ["users", "byIds", userIds],
    queryFn: () => UserService.getUsersByIds(userIds),
    enabled: userIds.length > 0,
  });
}

export function useSubmissionsByMarathon(marathonId: string) {
  return useQuery({
    queryKey: ["submissions", "marathon", marathonId],
    queryFn: () => SubmissionService.findAllByMarathonId(marathonId),
    enabled: !!marathonId,
  });
}

export function useUserSubmissions() {
  return useQuery({
    queryKey: ["submissions", "user"],
    queryFn: () => SubmissionService.findAllByUserId(),
  });
}
