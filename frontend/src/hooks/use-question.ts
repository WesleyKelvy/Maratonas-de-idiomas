import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  QuestionService,
  type Question,
  type CreateQuestionRequest,
  type UpdateQuestionRequest,
  type GeminiQuestionResponse,
  type SaveQuestionsRequest,
} from "@/services/question.service";

// Query Keys
export const questionKeys = {
  all: ["questions"] as const,
  lists: () => [...questionKeys.all, "list"] as const,
  list: (marathonId: string) =>
    [...questionKeys.lists(), { marathonId }] as const,
  details: () => [...questionKeys.all, "detail"] as const,
  detail: (id: number) => [...questionKeys.details(), id] as const,
} as const;

// Hook para obter uma questão específica por ID
export const useQuestion = (id: number) => {
  return useQuery({
    queryKey: questionKeys.detail(id),
    queryFn: () => QuestionService.findOne(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Hook para obter questões de uma maratona
export const useQuestionsByMarathon = (marathonId: string) => {
  return useQuery({
    queryKey: questionKeys.list(marathonId),
    queryFn: () => QuestionService.findAllByMarathonId(marathonId),
    enabled: !!marathonId,
    staleTime: 2 * 60 * 1000, // 2 minutos
    refetchOnWindowFocus: false,
  });
};

// Hook para gerar questões com IA
export const useGenerateQuestionsWithGemini = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (marathonId: string) =>
      QuestionService.generateQuestionsWithGemini(marathonId),
    onSuccess: (_, marathonId) => {
      // Invalidate questions list for this marathon
      queryClient.invalidateQueries({
        queryKey: questionKeys.list(marathonId),
      });
    },
  });
};

// Hook para salvar questões
export const useSaveQuestions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      marathonId,
      data,
    }: {
      marathonId: string;
      data: SaveQuestionsRequest[];
    }) => QuestionService.saveQuestions(marathonId, data),
    onSuccess: (_, { marathonId }) => {
      queryClient.invalidateQueries({
        queryKey: questionKeys.list(marathonId),
      });
    },
  });
};

// Hook para atualizar questão
export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
      marathonId,
    }: {
      id: number;
      data: UpdateQuestionRequest;
      marathonId: string;
    }) => QuestionService.update(id, data),
    onSuccess: (updatedQuestion, { marathonId }) => {
      // Update the question in cache
      queryClient.setQueryData(
        questionKeys.detail(updatedQuestion.id),
        updatedQuestion
      );
      // Invalidate the marathon questions list
      queryClient.invalidateQueries({
        queryKey: questionKeys.list(marathonId),
      });
    },
  });
};

// Hook para deletar questão
export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, marathonId }: { id: number; marathonId: string }) =>
      QuestionService.remove(id),
    onSuccess: (_, { marathonId, id }) => {
      // Remove the question from cache
      queryClient.removeQueries({
        queryKey: questionKeys.detail(id),
      });
      // Invalidate the marathon questions list
      queryClient.invalidateQueries({
        queryKey: questionKeys.list(marathonId),
      });
    },
  });
};
