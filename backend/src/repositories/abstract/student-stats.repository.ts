import { StudentStats } from '@prisma/client';
import { UpdateStudentStatsDto } from 'src/Stats/dto/student.update-stats.dto copy';

export abstract class AbstractStudentStatsRepository {
  abstract create(id: string): Promise<Omit<StudentStats, 'userId'>>;
  abstract findByUserId(
    userId: string,
  ): Promise<Omit<StudentStats, 'userId'> | null>;
  abstract update(
    id: string,
    updateStatsDto: UpdateStudentStatsDto,
  ): Promise<Omit<StudentStats, 'userId'>>;
}

export const STUDENT_STATS_REPOSITORY_TOKEN = 'STUDENT_STATS_REPOSITORY_TOKEN';
