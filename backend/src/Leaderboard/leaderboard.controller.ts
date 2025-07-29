import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
} from '@nestjs/common';
import { Leaderboard } from '@prisma/client';
import {
  AbstractLeaderboardService,
  LEADERBOARD_SERVICE_TOKEN,
} from 'src/Leaderboard/abstract-services/abstract-leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(
    @Inject(LEADERBOARD_SERVICE_TOKEN)
    private readonly leaderboardService: AbstractLeaderboardService,
  ) {}

  /**
   * Fetches the leaderboard for a specific marathon.
   * Anyone authenticated can view the leaderboard.
   * @param marathonId The ID of the marathon.
   * @returns A promise that resolves to the leaderboard data.
   */
  @Get(':marathonId')
  @HttpCode(HttpStatus.OK)
  getLeaderboardForMarathon(
    @Param('marathonId') marathonId: string,
  ): Promise<Leaderboard[]> {
    return this.leaderboardService.getLeaderboardForMarathon(marathonId);
  }
}
