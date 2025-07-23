import { ProfessorStats } from '@prisma/client';
import { CreateProfessorStatsDto } from 'src/stats/dto/professor.create-stats.dto';
import { UpdateProfessorStatsDto } from 'src/stats/dto/professor.update-stats.dto';

export abstract class AbstractProfessorStatsService {
  abstract create(
    createStatDto: CreateProfessorStatsDto,
  ): Promise<ProfessorStats>;
  abstract update(
    id: string,
    updateStatDto: UpdateProfessorStatsDto,
  ): Promise<ProfessorStats>;
  abstract remove(id: string): Promise<void>;
}

export const PROFESSOR_STATS_SERVICE_TOKEN = 'PROFESSOR_STATS_SERVICE_TOKEN';
