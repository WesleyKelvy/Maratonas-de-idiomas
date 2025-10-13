import { StudentStats } from '@prisma/client';
import { CreateLeaderboardDto } from 'src/Leaderboard/dto/leaderboard.create.dto';

export abstract class AbstractStudentStatsService {
  abstract create(id: string): Promise<Omit<StudentStats, 'userId'>>;
  abstract findOne(id: string): Promise<Omit<StudentStats, 'userId'>>;
  abstract updateStudentStats(leaderboardDto: CreateLeaderboardDto[]);
  // abstract remove(id: string): Promise<void>;
  // abstract update(
  //   id: string,
  //   updateStatDto: UpdateStudentStatsDto,
  // ): Promise<StudentStats>;
}

export const STUDENT_STATS_SERVICE_TOKEN = 'STUDENT_STATS_SERVICE_TOKEN';
