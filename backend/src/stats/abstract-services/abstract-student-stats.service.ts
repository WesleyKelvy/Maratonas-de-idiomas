import { StudentStats } from '@prisma/client';
import { CreateStudentStatsDto } from 'src/stats/dto/student.create-stats.dto copy';
import { UpdateStudentStatsDto } from 'src/stats/dto/student.update-stats.dto copy';

export abstract class AbstractStudentStatsService {
  abstract create(createStatDto: CreateStudentStatsDto): Promise<StudentStats>;
  abstract update(
    id: string,
    updateStatDto: UpdateStudentStatsDto,
  ): Promise<StudentStats>;
  abstract remove(id: string): Promise<void>;
}

export const STUDENT_STATS_SERVICE_TOKEN = 'STUDENT_STATS_SERVICE_TOKEN';
