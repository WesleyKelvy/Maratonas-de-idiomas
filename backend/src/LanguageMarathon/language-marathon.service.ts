import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LanguageMarathon } from '@prisma/client';
import { CLASSROOM_SERVICE_TOKEN } from 'src/Classroom/abstract-services/abstract-classrom.service';
import { AbstractLanguageMarathonService } from 'src/LanguageMarathon/abstract-services/abstract-language-marathon.service';
import { CreateLanguageMarathonDto } from 'src/LanguageMarathon/dto/language-marathon.create.dto';
import { UpdateLanguageMarathonDto } from 'src/LanguageMarathon/dto/language-marathon.update.dto';
import {
  AbstractLeaderboardService,
  LEADERBOARD_SERVICE_TOKEN,
} from 'src/Leaderboard/abstract-services/abstract-leaderboard.service';
import { AbstractClassroomRepository } from 'src/repositories/abstract/classroom.repository';
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
    @Inject(LANGUAGE_MARATHON_REPOSITORY_TOKEN)
    private readonly marathonRepository: AbstractLanguageMarathonRepository,
    @Inject(PROFESSOR_STATS_SERVICE_TOKEN)
    private readonly professorStatsService: AbstractProfessorStatsService,
    @Inject(LEADERBOARD_SERVICE_TOKEN)
    private readonly leaderboardService: AbstractLeaderboardService,
    @Inject(CLASSROOM_SERVICE_TOKEN)
    private readonly classroomService: AbstractClassroomRepository,
  ) {}

  async findAllByClassroomCode(code: string): Promise<LanguageMarathon[]> {
    const classroom = await this.classroomService.findByCode(code);

    if (!classroom)
      throw new NotFoundException(`No found classroom for code: ${code}.`);

    const marathons =
      await this.marathonRepository.findAllByClassroomCode(code);

    return marathons;
  }

  async create(
    dto: CreateLanguageMarathonDto,
    classroomCode: string,
    professorId: string,
  ): Promise<LanguageMarathon> {
    const classroom = await this.classroomService.findByCode(classroomCode);

    if (classroom.created_by !== professorId)
      throw new ForbiddenException('Not allowed!');

    await this.professorStatsService.incrementMarathonsProfessorStats(
      professorId,
    );

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMinutes(startDate.getMinutes() + dto.timeLimit);

    const newMarathon = await this.marathonRepository.create(
      { ...dto, endDate: endDate, startDate },
      classroomCode,
      professorId,
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
    userId: string,
  ): Promise<LanguageMarathon> {
    const marathon = await this.marathonRepository.findOneById(id);
    if (!marathon) {
      throw new NotFoundException(`Marathon with ID ${id} not found.`);
    }

    if (marathon.created_by !== userId)
      throw new ForbiddenException('Not allowed!');

    if (dto.endDate < dto.startDate || dto.startDate < new Date()) {
      throw new BadRequestException();
    }

    const updatedMarathon = await this.marathonRepository.update(
      marathon.id,
      dto,
      userId,
    );

    if (updatedMarathon.end_date) {
      this.leaderboardService.deleteScheduledLeaderboardGeneration(
        updatedMarathon.id,
      );

      this.leaderboardService.scheduleLeaderboardGeneration(
        updatedMarathon.id,
        updatedMarathon.end_date,
      );
    }

    return updatedMarathon;
  }

  async remove(id: string, userId: string): Promise<void> {
    const marathon = await this.marathonRepository.findOneById(id);

    if (!marathon) {
      throw new NotFoundException(`Marathon with ID ${id} not found.`);
    }

    if (marathon.created_by !== userId)
      throw new ForbiddenException('Not allowed!');

    this.leaderboardService.deleteScheduledLeaderboardGeneration(id);

    await this.marathonRepository.remove(id, userId);
  }
}
