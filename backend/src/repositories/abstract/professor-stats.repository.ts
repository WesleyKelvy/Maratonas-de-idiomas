import { ProfessorStats as PrismaProfessorStats } from '@prisma/client'; // Use TeacherStats from Prisma
import { UpdateProfessorStatsDto } from 'src/Stats/dto/professor.update-stats.dto';

export abstract class AbstractProfessorStatsRepository {
  abstract create(id: string): Promise<PrismaProfessorStats>;
  abstract findByUserId(userId: string): Promise<PrismaProfessorStats | null>;
  abstract update(
    id: string,
    updateStatDto: UpdateProfessorStatsDto,
  ): Promise<PrismaProfessorStats>;
  abstract remove(id: string): Promise<void>;
  abstract incrementClasses(userId: string): Promise<void>;
  abstract incrementMarathons(userId: string): Promise<void>;
  abstract incrementStudentsReached(userId: string): Promise<void>;
}

export const PROFESSOR_STATS_REPOSITORY_TOKEN =
  'PROFESSOR_STATS_REPOSITORY_TOKEN';
