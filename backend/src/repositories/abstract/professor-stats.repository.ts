import { ProfessorStats as PrismaProfessorStats } from '@prisma/client'; // Use TeacherStats from Prisma
import { UpdateProfessorStatsDto } from 'src/stats/dto/professor.update-stats.dto';

export abstract class AbstractProfessorStatsRepository {
  abstract create(id: string): Promise<PrismaProfessorStats>;
  abstract findByUserId(userId: string): Promise<PrismaProfessorStats | null>;
  abstract update(
    id: string,
    updateStatDto: UpdateProfessorStatsDto,
  ): Promise<PrismaProfessorStats>;
  abstract remove(id: string): Promise<void>;
}

export const PROFESSOR_STATS_REPOSITORY_TOKEN =
  'PROFESSOR_STATS_REPOSITORY_TOKEN';
