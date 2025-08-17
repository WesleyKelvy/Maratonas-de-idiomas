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
    // 1) Fetch all scored submissions in this marathon
    const submissions = await this.prisma.submission.findMany({
      where: {
        question: { marathon_id: marathonId },
        score: { not: null },
      },
      select: { user_id: true, score: true },
    });

    // 2) Sum up scores per student
    const userScores = new Map<string, number>();
    for (const { user_id, score } of submissions) {
      const prev = userScores.get(user_id) ?? 0;
      userScores.set(user_id, prev + (score ?? 0));
    }

    // 3) Get all enrolled students for this marathon
    const enrollments = await this.prisma.enrollment.findMany({
      where: { marathon_id: marathonId },
      select: { user_id: true },
    });

    // 4) Build ranking array
    const ranking = enrollments
      .map(({ user_id }) => ({
        userId: user_id,
        score: userScores.get(user_id) ?? 0,
      }))
      .sort((a, b) => b.score - a.score);

    // 5) Write to Leaderboard table
    const leaderboardData: CreateLeaderboardDto[] = ranking.map((u, idx) => ({
      marathon_id: marathonId,
      user_id: u.userId,
      score: u.score,
      position: idx + 1,
    }));
    // await this.leaderboardRepository.deleteByMarathonId(marathonId);
    await this.leaderboardRepository.createMany(leaderboardData);

    await this.studentStatsService.updateStudentStats(leaderboardData);

    // 6) Mark marathon as having a generated leaderboard
    await this.prisma.languageMarathon.update({
      where: { id: marathonId },
      data: { leaderboard_generated: true },
    });
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
