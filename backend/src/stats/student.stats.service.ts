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
} from 'src/repositories/student-stats.repository';
import { AbstractStudentStatsService } from 'src/stats/abstract-services/abstract-student-stats.service';
import { CreateStudentStatsDto } from 'src/stats/dto/student.create-stats.dto copy';
import { UpdateStudentStatsDto } from 'src/stats/dto/student.update-stats.dto copy';

@Injectable()
export class StudentStatsService implements AbstractStudentStatsService {
  constructor(
    @Inject(STUDENT_STATS_REPOSITORY_TOKEN)
    private readonly studentStatsRepository: AbstractStudentStatsRepository,
  ) {}

  async create(createStatDto: CreateStudentStatsDto): Promise<StudentStats> {
    // Example business logic: Prevent creating multiple stats for the same user
    const existingStat = await this.studentStatsRepository.findByUserId(
      createStatDto.userId,
    );
    if (existingStat) {
      throw new ConflictException(
        `Student stats for user ID ${createStatDto.userId} already exist.`,
      );
    }

    const createdPrismaStat =
      await this.studentStatsRepository.create(createStatDto);
    // Map Prisma's generated type back to your custom entity if necessary
    const studentStat: StudentStats = {
      userId: createdPrismaStat.userId,
      total_points: createdPrismaStat.total_points,
      marathons_participated: createdPrismaStat.marathons_participated,
      podiums: createdPrismaStat.podiums,
      first_places: createdPrismaStat.first_places,
    };
    return studentStat;
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
