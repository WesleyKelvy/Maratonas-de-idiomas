import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ReportService,
  type Report,
  type CreateReportRequest,
} from "@/services/report.service";

// Query Keys
export const reportKeys = {
  all: ["reports"] as const,
  details: () => [...reportKeys.all, "detail"] as const,
  detail: (marathonId: string) =>
    [...reportKeys.details(), marathonId] as const,
} as const;

// Hook para obter relatório de uma maratona
export const useReport = (marathonId: string) => {
  return useQuery({
    queryKey: reportKeys.detail(marathonId),
    queryFn: () => ReportService.findByMarathonId(marathonId),
    enabled: !!marathonId,
    staleTime: 2 * 60 * 1000, // 2 minutos (relatórios podem ser mais dinâmicos)
    refetchOnWindowFocus: false,
  });
};

// Hook para criar relatório
export const useCreateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (marathonId: string) => ReportService.createReport(marathonId),
    onSuccess: (_, marathonId) => {
      queryClient.invalidateQueries({
        queryKey: reportKeys.detail(marathonId),
      });
    },
  });
};
