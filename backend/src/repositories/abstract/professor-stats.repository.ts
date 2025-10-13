import { ProfessorStats } from '@prisma/client';
import { UpdateProfessorStatsDto } from 'src/Stats/dto/professor.update-stats.dto';

export abstract class AbstractProfessorStatsRepository {
  abstract create(id: string): Promise<Omit<ProfessorStats, 'userId'>>;
  abstract findByUserId(
    userId: string,
  ): Promise<Omit<ProfessorStats, 'userId'> | null>;
  abstract update(
    id: string,
    updateStatDto: UpdateProfessorStatsDto,
  ): Promise<Omit<ProfessorStats, 'userId'>>;
  abstract incrementClasses(userId: string): Promise<void>;
  abstract incrementMarathons(userId: string): Promise<void>;
  abstract incrementStudentsReached(userId: string): Promise<void>;
}

export const PROFESSOR_STATS_REPOSITORY_TOKEN =
  'PROFESSOR_STATS_REPOSITORY_TOKEN';
