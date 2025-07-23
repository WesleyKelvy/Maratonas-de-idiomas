import { StudentStats as PrismaStudentStats } from '@prisma/client';
import { UpdateStudentStatsDto } from 'src/stats/dto/student.update-stats.dto copy';

export abstract class AbstractStudentStatsRepository {
  abstract create(
    createStatDto: UpdateStudentStatsDto,
  ): Promise<PrismaStudentStats>;
  abstract findByUserId(userId: string): Promise<PrismaStudentStats | null>;
  abstract update(
    id: string,
    updateStatDto: UpdateStudentStatsDto,
  ): Promise<PrismaStudentStats>;
  abstract remove(id: string): Promise<void>;
}

export const STUDENT_STATS_REPOSITORY_TOKEN = 'STUDENT_STATS_REPOSITORY_TOKEN';
