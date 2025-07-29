import { Leaderboard, Prisma } from '@prisma/client';

export abstract class AbstractLeaderboardRepository {
  /**
   * Creates multiple leaderboard entries in a single transaction.
   * @param data An array of data to create leaderboard entries.
   */
  abstract createMany(data: Prisma.LeaderboardCreateManyInput[]): Promise<void>;

  /**
   * Finds all leaderboard entries for a given marathon, ordered by position.
   * @param marathonId The ID of the marathon.
   * @returns A promise that resolves to an array of Leaderboard entries or null.
   */
  abstract findByMarathonId(marathonId: string): Promise<Leaderboard[] | null>;

  /**
   * Deletes all leaderboard entries associated with a specific marathon.
   * This is useful for regenerating a leaderboard.
   * @param marathonId The ID of the marathon.
   */
  abstract deleteByMarathonId(marathonId: string): Promise<void>;
}

export const LEADERBOARD_REPOSITORY_TOKEN = 'LEADERBOARD_REPOSITORY_TOKEN';
