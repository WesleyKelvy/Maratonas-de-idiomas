import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Leaderboard, Prisma } from '@prisma/client';
import { Queue } from 'bull';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AbstractLeaderboardRepository,
  LEADERBOARD_REPOSITORY_TOKEN,
} from 'src/repositories/abstract/leaderboard.repository';
import { AbstractLeaderboardService } from './abstract-services/abstract-leaderboard.service';

@Injectable()
export class LeaderboardService implements AbstractLeaderboardService {
  private readonly logger = new Logger(LeaderboardService.name);

  constructor(
    @Inject(LEADERBOARD_REPOSITORY_TOKEN)
    private readonly leaderboardRepository: AbstractLeaderboardRepository,
    private readonly prisma: PrismaService,
    // Inject the 'leaderboard' queue
    @InjectQueue('leaderboard') private readonly leaderboardQueue: Queue,
  ) {}

  /**
   * Schedules a job to generate a leaderboard at a specific time.
   * @param marathonId The ID of the marathon.
   * @param endDate The exact date and time the leaderboard should be generated.
   */
  async scheduleLeaderboardGeneration(
    marathonId: string,
    endDate: Date,
  ): Promise<void> {
    const now = new Date();
    const delay = endDate.getTime() - now.getTime();

    if (delay <= 0) {
      this.logger.warn(
        `Marathon ${marathonId} has already ended. Generating leaderboard immediately.`,
      );
      // If the end date is in the past, generate it right away.
      await this.generateLeaderboardForMarathon(marathonId);
      return;
    }

    // Add a job to the queue with a specific name 'generate' and a delay.
    // Bull will hold this job and only release it to the processor after the delay.
    await this.leaderboardQueue.add(
      'generate',
      { marathonId },
      {
        delay,
        // Optional: remove job from redis after it's completed
        removeOnComplete: true,
        // Optional: unique job ID to prevent duplicates if the marathon is updated multiple times
        jobId: `marathon-${marathonId}`,
      },
    );

    this.logger.log(
      `Scheduled leaderboard generation for marathon ${marathonId} to run at ${endDate.toISOString()}`,
    );
  }

  /**
   * The core logic to generate and save the leaderboard for a given marathon.
   * This method is now called by the LeaderboardProcessor.
   * @param marathonId The ID of the marathon.
   */
  async generateLeaderboardForMarathon(marathonId: string): Promise<void> {
    // This logic remains the same as before.
    const submissions = await this.prisma.submission.findMany({
      where: { question: { marathon_id: marathonId }, score: { not: null } },
      select: { user_id: true, score: true },
    });

    const userScores = new Map<string, number>();
    for (const submission of submissions) {
      const currentScore = userScores.get(submission.user_id) || 0;
      userScores.set(submission.user_id, currentScore + submission.score);
    }

    const enrollments = await this.prisma.enrollment.findMany({
      where: { marathon_id: marathonId },
      select: { user_id: true },
    });

    const rankedUsers = enrollments
      .map((enrollment) => ({
        userId: enrollment.user_id,
        score: userScores.get(enrollment.user_id) || 0,
      }))
      .sort((a, b) => b.score - a.score);

    const leaderboardData: Prisma.LeaderboardCreateManyInput[] =
      rankedUsers.map((user, index) => ({
        marathon_id: marathonId,
        user_id: user.userId,
        score: user.score,
        position: index + 1,
      }));

    await this.leaderboardRepository.deleteByMarathonId(marathonId);
    await this.leaderboardRepository.createMany(leaderboardData);

    // Mark the marathon so we know the leaderboard was generated
    await this.prisma.languageMarathon.update({
      where: { id: marathonId },
      data: { leaderboard_generated: true },
    });
  }

  /**
   * Retrieves the leaderboard for a specific marathon. This remains unchanged.
   * @param marathonId The ID of the marathon.
   */
  async getLeaderboardForMarathon(marathonId: string): Promise<Leaderboard[]> {
    const leaderboard =
      await this.leaderboardRepository.findByMarathonId(marathonId);
    if (!leaderboard || leaderboard.length === 0) {
      throw new NotFoundException(
        `Leaderboard for marathon with ID "${marathonId}" not found or not generated yet.`,
      );
    }
    return leaderboard;
  }
}
