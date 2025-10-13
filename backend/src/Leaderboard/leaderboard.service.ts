import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Leaderboard } from '@prisma/client';
import { Queue } from 'bull';
import { CreateLeaderboardDto } from 'src/Leaderboard/dto/leaderboard.create.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AbstractLeaderboardRepository,
  LEADERBOARD_REPOSITORY_TOKEN,
} from 'src/repositories/abstract/leaderboard.repository';
import { STUDENT_STATS_SERVICE_TOKEN } from 'src/Stats/abstract-services/abstract-student-stats.service';
import { StudentStatsService } from 'src/Stats/student.stats.service';
import { AbstractLeaderboardService } from './abstract-services/abstract-leaderboard.service';

@Injectable()
export class LeaderboardService implements AbstractLeaderboardService {
  private readonly logger = new Logger(LeaderboardService.name);

  constructor(
    @Inject(STUDENT_STATS_SERVICE_TOKEN)
    private readonly studentStatsService: StudentStatsService,
    @Inject(LEADERBOARD_REPOSITORY_TOKEN)
    private readonly leaderboardRepository: AbstractLeaderboardRepository,
    private readonly prisma: PrismaService,
    @InjectQueue('leaderboard') private readonly leaderboardQueue: Queue,
  ) {}

  async scheduleLeaderboardGeneration(
    marathonId: string,
    endDate: Date,
  ): Promise<void> {
    const now = new Date();
    const delay = endDate.getTime() - now.getTime();

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

  async generateLeaderboardForMarathon(marathonId: string): Promise<void> {
    // 1. In parallel, search for aggregated scores AND enrolled students
    const [scoredUsers, enrollments] = await Promise.all([
      this.prisma.submission.groupBy({
        by: ['user_id'],
        where: {
          question: { marathon_id: marathonId },
          score: { not: null },
        },
        _sum: {
          score: true, // Sum the 'score' column for each group
        },
      }),

      // Query 2: Get all enrolled students
      this.prisma.enrollment.findMany({
        where: { marathon_id: marathonId },
        select: { user_id: true },
      }),
    ]);

    // 2. Maps scores for quick search
    const userScores = new Map<string, number>(
      scoredUsers.map((u) => [u.user_id, u._sum.score ?? 0]),
    );

    // 3. Create the ranking, guaranteeing 0 points for those who signed up but didn't score
    const ranking = enrollments
      .map(({ user_id }) => ({
        userId: user_id,
        score: userScores.get(user_id) ?? 0,
      }))
      .sort((a, b) => b.score - a.score);

    // 4. Prepare the data for insertion into the leaderboard
    const leaderboardData: CreateLeaderboardDto[] = ranking.map((u, idx) => ({
      marathon_id: marathonId,
      user_id: u.userId,
      score: u.score,
      position: idx + 1,
    }));

    // 5. Perform all write operations in a single atomic transaction
    await this.prisma.$transaction([
      // Create the new leaderboard
      this.leaderboardRepository.createMany(leaderboardData),

      // Mark marathon as leaderboard generated
      this.prisma.languageMarathon.update({
        where: { id: marathonId },
        data: { leaderboard_generated: true },
      }),
    ]);

    await this.studentStatsService.updateStudentStats(leaderboardData);
  }

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

  async deleteScheduledLeaderboardGeneration(
    marathonId: string,
  ): Promise<void> {
    const job = await this.leaderboardQueue.getJob(`marathon-${marathonId}`);
    await job?.remove();

    this.logger.log(
      `Deleted scheduled leaderboard generation for marathon ${marathonId}}`,
    );
  }
}
