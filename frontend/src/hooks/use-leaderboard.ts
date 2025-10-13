import {
  LeaderboardService,
  type LeaderboardEntry,
} from "@/services/leaderboard.service";
import { useQuery } from "@tanstack/react-query";

// Query Keys
export const leaderboardKeys = {
  all: ["leaderboard"] as const,
  marathon: (marathonId: string) =>
    [...leaderboardKeys.all, "marathon", marathonId] as const,
} as const;

export const useLeaderboard = (marathonId: string) => {
  return useQuery({
    queryKey: leaderboardKeys.marathon(marathonId),
    queryFn: () => LeaderboardService.getLeaderboardForMarathon(marathonId),
    enabled: !!marathonId && marathonId !== "all", // Don't fetch if "all" is selected
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
