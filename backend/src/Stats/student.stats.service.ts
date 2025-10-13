import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StudentStats } from '@prisma/client';
import { CreateLeaderboardDto } from 'src/Leaderboard/dto/leaderboard.create.dto';
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

  async create(id: string): Promise<Omit<StudentStats, 'userId'>> {
    // Example business logic: Prevent creating multiple stats for the same user
    const existingStat = await this.studentStatsRepository.findByUserId(id);
    if (existingStat) {
      throw new ConflictException(
        `Student stats for user ID ${id} already exist.`,
      );
    }

    return await this.studentStatsRepository.create(id);
  }

  async findByUserId(id: string): Promise<Omit<StudentStats, 'userId'>> {
    const studentStats = await this.studentStatsRepository.findByUserId(id);
    if (!studentStats) {
      throw new NotFoundException(`Student stats with ID ${id} not found.`);
    }
    return studentStats;
  }

  async update(
    id: string,
    updateStatDto: UpdateStudentStatsDto,
  ): Promise<Omit<StudentStats, 'userId'>> {
    const existingStat = await this.studentStatsRepository.findByUserId(id);
    if (!existingStat) {
      throw new NotFoundException(`Student stats with ID ${id} not found.`);
    }
    return await this.studentStatsRepository.update(id, updateStatDto);
  }

  // async remove(id: string): Promise<void> {
  //   const existingStat = await this.studentStatsRepository.findByUserId(id);
  //   if (!existingStat) {
  //     throw new NotFoundException(`Student stats with ID ${id} not found.`);
  //   }
  //   await this.studentStatsRepository.remove(id);
  // }

  async updateStudentStats(leaderboardDto: CreateLeaderboardDto[]) {
    for (const { user_id, score, position } of leaderboardDto.map((u) => ({
      ...u,
    }))) {
      // load existing stats
      const stats = await this.findByUserId(user_id);

      // prepare updates
      const updates: Partial<UpdateStudentStatsDto> = {
        total_points: stats.total_points + score,
        marathons_participated: stats.marathons_participated + 1,
      };

      // podium = top 3
      if (position <= 3) {
        updates.podiums = stats.podiums + 1;
        if (position === 1) {
          updates.first_places = stats.first_places + 1;
        }
      }

      await this.update(user_id, updates as UpdateStudentStatsDto);
    }
  }
}
