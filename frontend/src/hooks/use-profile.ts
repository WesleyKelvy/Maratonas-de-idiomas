import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ProfileService,
  type StudentStats,
  type ProfessorStats,
  type LanguageMarathon,
  type UserUpdateRequest,
} from "@/services/profile.service";

// Query Keys
export const profileKeys = {
  all: ["profile"] as const,
  stats: (userId: string, role: string) =>
    [...profileKeys.all, "stats", userId, role] as const,
  marathons: () => [...profileKeys.all, "marathons"] as const,
} as const;

// Hook para buscar estatísticas do estudante
export const useStudentStats = (
  userId: string | undefined,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: profileKeys.stats(userId || "", "student"),
    queryFn: () => ProfileService.getStudentStats(userId!),
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para buscar estatísticas do professor
export const useProfessorStats = (
  userId: string | undefined,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: profileKeys.stats(userId || "", "professor"),
    queryFn: () => ProfileService.getProfessorStats(userId!),
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para buscar maratonas do usuário
export const useUserMarathons = () => {
  return useQuery({
    queryKey: profileKeys.marathons(),
    queryFn: ProfileService.getUserMarathons,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para atualizar dados do usuário
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserUpdateRequest) => ProfileService.updateUser(data),
    onSuccess: () => {
      // Invalidar cache do usuário para buscar dados atualizados
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
};
