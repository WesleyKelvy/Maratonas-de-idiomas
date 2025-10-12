import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AbstractClassroomService } from 'src/Classroom/abstract-services/abstract-classrom.service';
import { CreateClassroomDto } from 'src/Classroom/dto/classroom.create.dto';
import { UpdateClassroomDto } from 'src/Classroom/dto/classroom.update.dto';
import {
  Classroom,
  ClassroomWithMarathonIds,
  ClassroomWithMarathons,
} from 'src/Classroom/entities/classroom.entity';
import {
  AbstractClassroomRepository,
  CLASSROOM_REPOSITORY_TOKEN,
} from 'src/repositories/abstract/classroom.repository';
import {
  AbstractProfessorStatsService,
  PROFESSOR_STATS_SERVICE_TOKEN,
} from 'src/Stats/abstract-services/abstract-professor-stats.service';

@Injectable()
export class ClassroomService implements AbstractClassroomService {
  constructor(
    @Inject(PROFESSOR_STATS_SERVICE_TOKEN)
    private readonly professorStatsService: AbstractProfessorStatsService,
    @Inject(CLASSROOM_REPOSITORY_TOKEN)
    private readonly classroomRepository: AbstractClassroomRepository,
  ) {}

  async findOneByMarathonId(id: string): Promise<ClassroomWithMarathons> {
    const classroom = await this.classroomRepository.findOneByMarathonId(id);
    if (!classroom) {
      throw new NotFoundException(`No classroom found for marathon ID ${id}.`);
    }

    return classroom;
  }

  async findAllByUserId(id: string): Promise<ClassroomWithMarathonIds[]> {
    return await this.classroomRepository.findAllByUserId(id);
  }

  async create(dto: CreateClassroomDto, userId: string): Promise<Classroom> {
    await this.professorStatsService.incrementClassesProfessorStats(userId);

    return this.classroomRepository.create(dto, userId);
  }

  async findOne(id: string): Promise<ClassroomWithMarathonIds> {
    const classroom = await this.classroomRepository.findById(id);
    if (!classroom) {
      throw new NotFoundException(`No classroom found with Id ${id}`);
    }

    return classroom;
  }

  async update(
    id: string,
    dto: UpdateClassroomDto,
    userId: string,
  ): Promise<Classroom> {
    const classroom = await this.classroomRepository.findById(id);
    if (!classroom) {
      throw new NotFoundException(`No classroom found with Id ${id}`);
    }

    if (classroom.created_by !== userId)
      throw new ForbiddenException('Not allowed!');

    return this.classroomRepository.update(id, dto, userId);
  }

  async remove(id: string, userId: string): Promise<void> {
    const classroom = await this.classroomRepository.findById(id);
    if (!classroom) {
      throw new NotFoundException(`No classroom found with code ${id}`);
    }

    if (classroom.created_by !== userId)
      throw new ForbiddenException('Not allowed!');

    if (classroom?.marathons.length > 0)
      throw new BadRequestException(
        `Not allowed to delete a classroom with marathons`,
      );

    this.classroomRepository.remove(id, userId);
  }
}
