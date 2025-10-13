import { ProfessorStats } from '@prisma/client';

export abstract class AbstractProfessorStatsService {
  abstract create(id: string): Promise<Omit<ProfessorStats, 'userId'>>;
  abstract findOne(id: string): Promise<Omit<ProfessorStats, 'userId'>>;
  abstract incrementClassesProfessorStats(userId: string): Promise<void>;
  abstract incrementMarathonsProfessorStats(userId: string): Promise<void>;
  abstract incrementTotalStudentsProfessorStats(userId: string): Promise<void>;
  // abstract update(
  //   id: string,
  //   updateStatsDto: UpdateProfessorStatsDto,
  // ): Promise<ProfessorStats>;
  // abstract remove(id: string): Promise<void>;
}

export const PROFESSOR_STATS_SERVICE_TOKEN = 'PROFESSOR_STATS_SERVICE_TOKEN';
