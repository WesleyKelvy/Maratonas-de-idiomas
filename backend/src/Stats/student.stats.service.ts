import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StudentStats } from '@prisma/client';
import {
  AbstractStudentStatsRepository,
  STUDENT_STATS_REPOSITORY_TOKEN,
} from 'src/repositories/abstract/student-stats.repository';
import { AbstractStudentStatsService } from 'src/Stats/abstract-services/abstract-student-stats.service';
import { UpdateStudentStatsDto } from 'src/Stats/dto/student.update-stats.dto copy';

@Injectable()
export class StudentStatsService implements AbstractStudentStatsService {
  constructor(
    @Inject(STUDENT_STATS_REPOSITORY_TOKEN)
    private readonly studentStatsRepository: AbstractStudentStatsRepository,
  ) {}

  async create(id: string): Promise<StudentStats> {
    // Example business logic: Prevent creating multiple stats for the same user
    const existingStat = await this.studentStatsRepository.findByUserId(id);
    if (existingStat) {
      throw new ConflictException(
        `Student stats for user ID ${id} already exist.`,
      );
    }

    return await this.studentStatsRepository.create(id);
  }

  async findOne(id: string): Promise<StudentStats> {
    const prismaStat = await this.studentStatsRepository.findByUserId(id);
    if (!prismaStat) {
      throw new NotFoundException(`Student stats with ID ${id} not found.`);
    }
    return {
      userId: prismaStat.userId,
      total_points: prismaStat.total_points,
      marathons_participated: prismaStat.marathons_participated,
      podiums: prismaStat.podiums,
      first_places: prismaStat.first_places,
    };
  }

  async update(
    id: string,
    updateStatDto: UpdateStudentStatsDto,
  ): Promise<StudentStats> {
    const existingStat = await this.studentStatsRepository.findByUserId(id);
    if (!existingStat) {
      throw new NotFoundException(`Student stats with ID ${id} not found.`);
    }
    const updatedPrismaStat = await this.studentStatsRepository.update(
      id,
      updateStatDto,
    );
    return {
      userId: updatedPrismaStat.userId,
      total_points: updatedPrismaStat.total_points,
      marathons_participated: updatedPrismaStat.marathons_participated,
      podiums: updatedPrismaStat.podiums,
      first_places: updatedPrismaStat.first_places,
    };
  }

  async remove(id: string): Promise<void> {
    const existingStat = await this.studentStatsRepository.findByUserId(id);
    if (!existingStat) {
      throw new NotFoundException(`Student stats with ID ${id} not found.`);
    }
    await this.studentStatsRepository.remove(id);
  }
}
