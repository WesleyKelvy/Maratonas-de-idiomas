import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateEnrollmentRequest,
  Enrollment,
  EnrollmentService,
  EnrollmentWithMarathons,
} from "@/services/enrollment.service";
import { toast } from "./use-toast";

// Query Keys
const ENROLLMENT_KEYS = {
  all: ["enrollments"] as const,
  byUser: () => [...ENROLLMENT_KEYS.all, "user"] as const,
  byMarathon: (marathonId: string) =>
    [...ENROLLMENT_KEYS.all, "marathon", marathonId] as const,
} as const;

// Hook to get user enrollments
export function useUserEnrollments() {
  return useQuery({
    queryKey: ENROLLMENT_KEYS.byUser(),
    queryFn: () => EnrollmentService.findAllByUserId(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to get marathon enrollments (for professors)
export function useMarathonEnrollments(marathonId: string) {
  return useQuery({
    queryKey: ENROLLMENT_KEYS.byMarathon(marathonId),
    queryFn: () => EnrollmentService.findAllEnrollmentsByMarathonId(marathonId),
    enabled: !!marathonId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to create enrollment
export function useCreateEnrollment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEnrollmentRequest) =>
      EnrollmentService.createEnrollment(data),
    onSuccess: (enrollment) => {
      // Invalidate and refetch user enrollments
      queryClient.invalidateQueries({
        queryKey: ENROLLMENT_KEYS.byUser(),
      });

      // Show success message
      toast({
        title: "Inscrição realizada com sucesso!",
        description: "Você foi inscrito na maratona.",
      });
    },
    onError: (error: any) => {
      // Show error message
      toast({
        title: "Erro ao realizar inscrição",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Não foi possível realizar a inscrição. Tente novamente.",
        variant: "destructive",
      });
    },
  });
}
