import { Leaderboard } from '@prisma/client';

export abstract class AbstractLeaderboardService {
  abstract scheduleLeaderboardGeneration(
    marathonId: string,
    endDate: Date,
  ): Promise<void>;
  abstract generateLeaderboardForMarathon(marathonId: string): Promise<void>;
  abstract getLeaderboardForMarathon(
    marathonId: string,
  ): Promise<Leaderboard[]>;
  abstract deleteScheduledLeaderboardGeneration(
    marathonId: string,
  ): Promise<void>;
}

export const LEADERBOARD_SERVICE_TOKEN = 'LEADERBOARD_SERVICE_TOKEN';
