import { ProfessorStats } from '@prisma/client';
import { UpdateProfessorStatsDto } from 'src/stats/dto/professor.update-stats.dto';

export abstract class AbstractProfessorStatsService {
  abstract create(id: string): Promise<ProfessorStats>;
  abstract findOne(id: string): Promise<ProfessorStats>;
  abstract update(
    id: string,
    updateStatsDto: UpdateProfessorStatsDto,
  ): Promise<ProfessorStats>;
  abstract remove(id: string): Promise<void>;
}

export const PROFESSOR_STATS_SERVICE_TOKEN = 'PROFESSOR_STATS_SERVICE_TOKEN';
