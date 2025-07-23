import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProfessorStats } from '@prisma/client';
import {
  AbstractProfessorStatsRepository,
  PROFESSOR_STATS_REPOSITORY_TOKEN,
} from 'src/repositories/abstract/professor-stats.repository';
import { AbstractProfessorStatsService } from 'src/stats/abstract-services/abstract-professor-stats.service';
import { UpdateProfessorStatsDto } from 'src/stats/dto/professor.update-stats.dto';

@Injectable()
export class ProfessorStatsService implements AbstractProfessorStatsService {
  constructor(
    @Inject(PROFESSOR_STATS_REPOSITORY_TOKEN)
    private readonly professorStatsRepository: AbstractProfessorStatsRepository,
  ) {}

  async create(id: string): Promise<ProfessorStats> {
    // Example business logic: Prevent creating multiple stats for the same user
    const existingStat = await this.professorStatsRepository.findByUserId(id);
    if (existingStat) {
      throw new ConflictException(
        `Professor stats for user ID ${id} already exist.`,
      );
    }

    return await this.professorStatsRepository.create(id);
  }

  async findOne(id: string): Promise<ProfessorStats> {
    const prismaStat = await this.professorStatsRepository.findByUserId(id);
    if (!prismaStat) {
      throw new NotFoundException(`Professor stats with ID ${id} not found.`);
    }
    return {
      userId: prismaStat.userId,
      total_classes: prismaStat.total_classes,
      total_marathons: prismaStat.total_marathons,
      total_students_reached: prismaStat.total_students_reached,
    };
  }

  async update(
    id: string,
    updateStatDto: UpdateProfessorStatsDto,
  ): Promise<ProfessorStats> {
    const existingStat = await this.professorStatsRepository.findByUserId(id);
    if (!existingStat) {
      throw new NotFoundException(`Professor stats with ID ${id} not found.`);
    }
    const updatedPrismaStat = await this.professorStatsRepository.update(
      id,
      updateStatDto,
    );
    return {
      userId: updatedPrismaStat.userId,
      total_classes: updatedPrismaStat.total_classes,
      total_marathons: updatedPrismaStat.total_marathons,
      total_students_reached: updatedPrismaStat.total_students_reached,
    };
  }

  async remove(id: string): Promise<void> {
    const existingStat = await this.professorStatsRepository.findByUserId(id);
    if (!existingStat) {
      throw new NotFoundException(`Professor stats with ID ${id} not found.`);
    }
    await this.professorStatsRepository.remove(id);
  }
}
