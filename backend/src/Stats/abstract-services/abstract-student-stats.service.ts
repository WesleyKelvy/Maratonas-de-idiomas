import { StudentStats } from '@prisma/client';
import { CreateLeaderboardDto } from 'src/Leaderboard/dto/leaderboard.create.dto';
import { UpdateStudentStatsDto } from 'src/Stats/dto/student.update-stats.dto copy';

export abstract class AbstractStudentStatsService {
  abstract create(id: string): Promise<StudentStats>;
  abstract update(
    id: string,
    updateStatDto: UpdateStudentStatsDto,
  ): Promise<StudentStats>;
  abstract findByUserId(id: string): Promise<StudentStats>;
  abstract remove(id: string): Promise<void>;
  abstract updateStudentStats(leaderboardDto: CreateLeaderboardDto[]);
}

export const STUDENT_STATS_SERVICE_TOKEN = 'STUDENT_STATS_SERVICE_TOKEN';
