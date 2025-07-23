import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Classroom } from '@prisma/client';
import { randomBytes } from 'crypto';
import { AbstractClassroomService } from 'src/classroom/abstract-services/abstract-classrom.service';
import { CreateClassroomDto } from 'src/classroom/dto/classroom.create.dto';
import { UpdateClassroomDto } from 'src/classroom/dto/classroom.update.dto';
import {
  AbstractClassroomRepository,
  CLASSROOM_REPOSITORY_TOKEN,
} from 'src/repositories/abstract/classroom.repository';

@Injectable()
export class ClassroomService implements AbstractClassroomService {
  constructor(
    @Inject(CLASSROOM_REPOSITORY_TOKEN)
    private readonly classroomRepository: AbstractClassroomRepository,
  ) {}

  async findAllByUserId(id: string): Promise<Classroom[]> {
    const classroom = await this.classroomRepository.findAll(id);
    if (!classroom) {
      throw new NotFoundException(`Classrooms for this does not exist.`);
    }

    return classroom;
  }

  async create(dto: CreateClassroomDto, userId: string): Promise<Classroom> {
    const code = randomBytes(8).toString('hex');
    return await this.classroomRepository.create({ ...dto }, code, userId);
  }

  async findOne(code: string): Promise<Classroom> {
    const classroom = await this.classroomRepository.findByCode(code);
    if (!classroom) {
      throw new NotFoundException(`Classroom with code ${code} not found.`);
    }

    return classroom;
  }

  async update(code: string, dto: UpdateClassroomDto): Promise<Classroom> {
    const classroom = await this.classroomRepository.findByCode(code);
    if (!classroom) {
      throw new NotFoundException(`Classroom with code ${code} not found.`);
    }

    return await this.classroomRepository.update(classroom.code, dto);
  }

  async remove(code: string): Promise<void> {
    const existingClassroom = await this.classroomRepository.findByCode(code);
    if (!existingClassroom) {
      throw new NotFoundException(`Classroom with code ${code} not found.`);
    }
    await this.classroomRepository.remove(code);
  }
}
