import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { LEADERBOARD_REPOSITORY_TOKEN } from 'src/repositories/abstract/leaderboard.repository';
import { PrismaLeaderboardRepository } from 'src/repositories/prisma/prisma-leaderboard.repository';
import { LEADERBOARD_SERVICE_TOKEN } from './abstract-services/abstract-leaderboard.service';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardProcessor } from 'src/Leaderboard/leaderboard.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'leaderboard',
    }),
  ],
  controllers: [LeaderboardController],
  providers: [
    {
      provide: LEADERBOARD_SERVICE_TOKEN,
      useClass: LeaderboardService,
    },
    {
      provide: LEADERBOARD_REPOSITORY_TOKEN,
      useClass: PrismaLeaderboardRepository,
    },
    LeaderboardProcessor,
  ],
  exports: [LEADERBOARD_SERVICE_TOKEN],
})
export class LeaderboardModule {}
