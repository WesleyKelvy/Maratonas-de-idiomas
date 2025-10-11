import {
  MarathonService,
  type CreateMarathonRequest,
  type UpdateMarathonRequest
} from "@/services/marathon.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query Keys
export const marathonKeys = {
  all: ["marathons"] as const,
  lists: () => [...marathonKeys.all, "list"] as const,
  list: (classroomId: string) =>
    [...marathonKeys.lists(), { classroomId }] as const,
  details: () => [...marathonKeys.all, "detail"] as const,
  detail: (id: string) => [...marathonKeys.details(), id] as const,
} as const;

// Hook para obter maratonas de uma classroom
export const useMarathons = (classroomId: string) => {
  return useQuery({
    queryKey: marathonKeys.list(classroomId),
    queryFn: () => MarathonService.findAllByClassroom(classroomId),
    enabled: !!classroomId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
};

// Hook para obter uma maratona específica por ID
export const useMarathon = (marathonId: string) => {
  return useQuery({
    queryKey: marathonKeys.detail(marathonId),
    queryFn: () => MarathonService.findById(marathonId),
    enabled: !!marathonId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Hook para obter uma maratona específica por classroom e marathon ID
export const useMarathonByClassroom = (
  classroomId: string,
  marathonId: string
) => {
  return useQuery({
    queryKey: [...marathonKeys.detail(marathonId), "classroom", classroomId],
    queryFn: () => MarathonService.findOne(marathonId),
    enabled: !!classroomId && !!marathonId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Hook para criar maratona
export const useCreateMarathon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      classroomId,
      data,
    }: {
      classroomId: string;
      data: CreateMarathonRequest;
    }) => MarathonService.create(classroomId, data),
    onSuccess: (_, { classroomId }) => {
      queryClient.invalidateQueries({
        queryKey: marathonKeys.list(classroomId),
      });
    },
  });
};

// Hook para atualizar maratona
export const useUpdateMarathon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      classroomId,
      marathonId,
      data,
    }: {
      classroomId: string;
      marathonId: string;
      data: UpdateMarathonRequest;
    }) => MarathonService.update(marathonId, data),
    onSuccess: (_, { classroomId, marathonId }) => {
      queryClient.invalidateQueries({
        queryKey: marathonKeys.detail(marathonId),
      });
      queryClient.invalidateQueries({
        queryKey: marathonKeys.list(classroomId),
      });
    },
  });
};

// Hook para deletar maratona
export const useDeleteMarathon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      classroomId,
      marathonId,
    }: {
      classroomId: string;
      marathonId: string;
    }) => MarathonService.remove(marathonId),
    onSuccess: (_, { classroomId }) => {
      queryClient.invalidateQueries({
        queryKey: marathonKeys.list(classroomId),
      });
    },
  });
};
