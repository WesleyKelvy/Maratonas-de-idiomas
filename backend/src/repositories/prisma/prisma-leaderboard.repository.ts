import { Injectable } from '@nestjs/common';
import { Leaderboard, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AbstractLeaderboardRepository } from 'src/repositories/abstract/leaderboard.repository';

@Injectable()
export class PrismaLeaderboardRepository
  implements AbstractLeaderboardRepository
{
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates multiple leaderboard entries.
   * @param data The data for the new leaderboard entries.
   */
  async createMany(data: Prisma.LeaderboardCreateManyInput[]): Promise<void> {
    await this.prisma.leaderboard.createMany({
      data,
    });
  }

  /**
   * Finds the leaderboard for a marathon, ordered by position ascending.
   * It also includes the user's name for display purposes.
   * @param marathonId The ID of the marathon.
   */
  async findByMarathonId(marathonId: string): Promise<Leaderboard[] | null> {
    return this.prisma.leaderboard.findMany({
      where: {
        marathon_id: marathonId,
      },
      include: {
        user: {
          select: {
            name: true, // Include user's name in the result
          },
        },
      },
      orderBy: {
        position: 'asc', // Order by position
      },
    });
  }

  /**
   * Deletes all leaderboard entries for a specific marathon.
   * @param marathonId The ID of the marathon to clear the leaderboard for.
   */
  async deleteByMarathonId(marathonId: string): Promise<void> {
    await this.prisma.leaderboard.deleteMany({
      where: {
        marathon_id: marathonId,
      },
    });
  }
}
