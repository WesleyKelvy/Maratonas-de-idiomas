import { Leaderboard } from '@prisma/client';

export abstract class AbstractLeaderboardService {
  /**
   * Generates and saves the leaderboard for a given marathon.
   * This involves calculating scores from submissions and ranking users.
   * @param marathonId The ID of the marathon.
   */
  abstract generateLeaderboardForMarathon(marathonId: string): Promise<void>;

  /**
   * Retrieves the generated leaderboard for a specific marathon.
   * @param marathonId The ID of the marathon.
   * @returns A promise that resolves to an array of Leaderboard entries.
   */
  abstract getLeaderboardForMarathon(
    marathonId: string,
  ): Promise<Leaderboard[]>;
}

export const LEADERBOARD_SERVICE_TOKEN = 'LEADERBOARD_SERVICE_TOKEN';
