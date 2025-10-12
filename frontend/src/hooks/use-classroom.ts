import {
  ClassroomService,
  type CreateClassroomRequest,
  type UpdateClassroomRequest,
  type ClassroomWithMarathonsAndEnrollments,
} from "@/services/classroom.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query Keys
export const classroomKeys = {
  all: ["classrooms"] as const,
  lists: () => [...classroomKeys.all, "list"] as const,
  list: (filters: string) => [...classroomKeys.lists(), { filters }] as const,
  details: () => [...classroomKeys.all, "detail"] as const,
  detail: (id: string) => [...classroomKeys.details(), id] as const,
} as const;

// Hook para obter todas as classrooms do professor
export const useClassrooms = () => {
  return useQuery({
    queryKey: classroomKeys.lists(),
    queryFn: ClassroomService.findAllByUser,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
};

// Hook para obter uma classroom específica
export const useClassroom = (id: string) => {
  return useQuery<ClassroomWithMarathonsAndEnrollments>({
    queryKey: classroomKeys.detail(id),
    queryFn: () => ClassroomService.findOne(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}; // Hook para criar classroom
export const useCreateClassroom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClassroomRequest) => ClassroomService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classroomKeys.lists() });
    },
  });
};

// Hook para atualizar classroom
export const useUpdateClassroom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClassroomRequest }) =>
      ClassroomService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: classroomKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: classroomKeys.lists() });
    },
  });
};

// Hook para deletar classroom
export const useDeleteClassroom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ClassroomService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classroomKeys.lists() });
    },
  });
};
