import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AbstractLeaderboardService,
  LEADERBOARD_SERVICE_TOKEN,
} from './abstract-services/abstract-leaderboard.service';

/**
 * This processor handles jobs for the 'leaderboard' queue.
 * It also checks for pending leaderboards on application startup.
 */
@Processor('leaderboard')
export class LeaderboardProcessor implements OnModuleInit {
  private readonly logger = new Logger(LeaderboardProcessor.name);

  constructor(
    @Inject(LEADERBOARD_SERVICE_TOKEN)
    private readonly leaderboardService: AbstractLeaderboardService,
    // Inject PrismaService to check the database on startup
    private readonly prisma: PrismaService,
    @InjectQueue('leaderboard') private readonly leaderboardQueue: Queue,
  ) {}

  /**
   * This lifecycle hook runs once when the module has been initialized.
   * It's the perfect place to check for jobs that were missed while the server was offline.
   */
  async onModuleInit() {
    this.logger.log('Checking for marathons that have already ended...');

    const finishedMarathons = await this.prisma.languageMarathon.findMany({
      where: {
        end_date: { lte: new Date() },
        leaderboard_generated: false,
      },
    });

    if (finishedMarathons.length > 0) {
      this.logger.log(
        `Found ${finishedMarathons.length} finished marathons. Adding to queue...`,
      );
      for (const marathon of finishedMarathons) {
        // 2. Adicione um novo job à fila em vez de chamar o handler
        await this.leaderboardQueue.add('generate', {
          marathonId: marathon.id,
        });
      }
    } else {
      this.logger.log('No pending leaderboards to generate on startup.');
    }
  }

  /**
   * This method is triggered when a job with the name 'generate' is processed.
   * @param job The job containing data, such as the marathonId.
   */
  @Process('generate')
  async handleGenerateLeaderboard(job: Job<{ marathonId: string }>) {
    const { marathonId } = job.data;
    this.logger.log(
      `Starting leaderboard generation for marathon: ${marathonId}...`,
    );

    try {
      await this.leaderboardService.generateLeaderboardForMarathon(marathonId);
      this.logger.log(
        `Successfully generated leaderboard for marathon: ${marathonId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to generate leaderboard for marathon ${marathonId}`,
        error.stack,
      );
      // Optionally re-throw the error to have Bull retry the job based on your queue settings
      throw error;
    }
  }
}
