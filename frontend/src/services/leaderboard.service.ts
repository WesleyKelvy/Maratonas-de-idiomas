import { apiClient } from "@/lib/api-client";

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  marathon_id: string;
  score: number;
  completion_time: number;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export class LeaderboardService {
  private static readonly BASE_URL = "/leaderboard";

  // GET /leaderboard/:marathonId - getLeaderboardForMarathon
  static async getLeaderboardForMarathon(
    marathonId: string
  ): Promise<LeaderboardEntry[]> {
    return apiClient.get<LeaderboardEntry[]>(
      `${LeaderboardService.BASE_URL}/${marathonId}`
    );
  }
}
