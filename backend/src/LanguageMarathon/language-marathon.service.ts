import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { LanguageMarathon } from '@prisma/client';
import { AbstractLanguageMarathonService } from 'src/LanguageMarathon/abstract-services/abstract-language-marathon.service';
import { CreateLanguageMarathonDto } from 'src/LanguageMarathon/dto/language-marathon.create.dto';
import { UpdateLanguageMarathonDto } from 'src/LanguageMarathon/dto/language-marathon.update.dto';
import {
  AbstractLeaderboardService,
  LEADERBOARD_SERVICE_TOKEN,
} from 'src/Leaderboard/abstract-services/abstract-leaderboard.service';
import {
  AbstractLanguageMarathonRepository,
  LANGUAGE_MARATHON_REPOSITORY_TOKEN,
} from 'src/repositories/abstract/languageMarathon.repository';
import {
  AbstractProfessorStatsService,
  PROFESSOR_STATS_SERVICE_TOKEN,
} from 'src/Stats/abstract-services/abstract-professor-stats.service';

@Injectable()
export class LanguageMarathonService
  implements AbstractLanguageMarathonService
{
  constructor(
    @Inject(PROFESSOR_STATS_SERVICE_TOKEN)
    private readonly professorStatsService: AbstractProfessorStatsService,
    @Inject(LANGUAGE_MARATHON_REPOSITORY_TOKEN)
    private readonly marathonRepository: AbstractLanguageMarathonRepository,
    @Inject(LEADERBOARD_SERVICE_TOKEN)
    private readonly leaderboardService: AbstractLeaderboardService,
  ) {}

  async findAllByClassroomCode(code: string): Promise<LanguageMarathon[]> {
    const marathon = await this.marathonRepository.findAllByClassroomCode(code);
    if (!marathon) {
      throw new NotFoundException(
        `Marathons for this classroom does not exist.`,
      );
    }

    return marathon;
  }

  async create(
    dto: CreateLanguageMarathonDto,
    classroomCode: string,
    professorId: string,
  ): Promise<LanguageMarathon> {
    await this.professorStatsService.incrementMarathonsProfessorStats(
      professorId,
    );

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMinutes(startDate.getMinutes() + dto.timeLimit);

    const newMarathon = await this.marathonRepository.create(
      { ...dto, endDate: endDate, startDate },
      classroomCode,
    );

    if (newMarathon.end_date) {
      // console.log('Starting Job schedule');
      this.leaderboardService.scheduleLeaderboardGeneration(
        newMarathon.id,
        newMarathon.end_date,
      );
    }

    return newMarathon;
  }

  async findOne(id: string): Promise<LanguageMarathon> {
    const marathon = await this.marathonRepository.findOneById(id);
    if (!marathon) {
      throw new NotFoundException(`Marathon with ID ${id} not found.`);
    }

    return marathon;
  }

  async update(
    id: string,
    dto: UpdateLanguageMarathonDto,
  ): Promise<LanguageMarathon> {
    const marathon = await this.marathonRepository.findOneById(id);
    if (!marathon) {
      throw new NotFoundException(`Marathon with ID ${id} not found.`);
    }

    const updatedMarathon = await this.marathonRepository.update(
      marathon.id,
      dto,
    );

    if (updatedMarathon.end_date) {
      this.leaderboardService.scheduleLeaderboardGeneration(
        updatedMarathon.id,
        updatedMarathon.end_date,
      );
    }

    return updatedMarathon;
  }

  async remove(id: string): Promise<void> {
    const existingMarathons = await this.marathonRepository.findOneById(id);

    this.leaderboardService.deleteScheduledLeaderboardGeneration(id);

    if (!existingMarathons) {
      throw new NotFoundException(`Marathon with ID ${id} not found.`);
    }
    await this.marathonRepository.remove(id);
  }
}
