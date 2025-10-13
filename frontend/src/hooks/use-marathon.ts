import {
  MarathonService,
  type CreateMarathonRequest,
  type UpdateMarathonRequest,
  type CustomLanguageMarathon,
  type RecentMarathonsAndUserStats,
} from "@/services/marathon.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query Keys
export const marathonKeys = {
  all: ["marathons"] as const,
  lists: () => [...marathonKeys.all, "list"] as const,
  list: (classroomId: string) =>
    [...marathonKeys.lists(), { classroomId }] as const,
  userList: () => [...marathonKeys.lists(), "user"] as const,
  idsAndTitles: () => [...marathonKeys.all, "ids-and-titles"] as const,
  recentMarathons: () => [...marathonKeys.all, "recent-marathons"] as const,
  details: () => [...marathonKeys.all, "detail"] as const,
  detail: (id: string) => [...marathonKeys.details(), id] as const,
  withQuestions: (id: string) =>
    [...marathonKeys.details(), id, "with-questions"] as const,
} as const;

export const useMarathons = (classroomId: string) => {
  return useQuery({
    queryKey: marathonKeys.list(classroomId),
    queryFn: () => MarathonService.findAllByClassroom(classroomId),
    enabled: !!classroomId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
};

export const useMarathon = (marathonId: string) => {
  return useQuery({
    queryKey: marathonKeys.detail(marathonId),
    queryFn: () => MarathonService.findById(marathonId),
    enabled: !!marathonId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useMarathonByCode = (code: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: [...marathonKeys.all, "by-code", code],
    queryFn: () => MarathonService.findOneByCode(code),
    enabled: !!code && enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false, // Don't retry if marathon not found
  });
};

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

export const useMarathonWithQuestions = (marathonId: string) => {
  return useQuery({
    queryKey: marathonKeys.withQuestions(marathonId),
    queryFn: () => MarathonService.findOneWithQuestions(marathonId),
    enabled: !!marathonId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useMarathonIdsAndTitles = () => {
  return useQuery({
    queryKey: marathonKeys.idsAndTitles(),
    queryFn: () => MarathonService.findAllIdsAndTitle(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useUserMarathons = () => {
  return useQuery({
    queryKey: marathonKeys.userList(),
    queryFn: () => MarathonService.findAllByUserId(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useRecentMarathons = () => {
  return useQuery({
    queryKey: marathonKeys.recentMarathons(),
    queryFn: () => MarathonService.findRecentMarathonsAndUserStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

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
