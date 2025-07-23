import { Classroom } from '@prisma/client';
import { CreateClassroomDto } from 'src/classroom/dto/classroom.create.dto';
import { UpdateClassroomDto } from 'src/classroom/dto/classroom.update.dto';

export abstract class AbstractClassroomRepository {
  abstract create(
    dto: CreateClassroomDto,
    code: string,
    userId: string,
  ): Promise<Classroom>;
  abstract findByCode(userId: string): Promise<Classroom | null>;
  abstract findAll(userId: string): Promise<Classroom[]>;
  abstract update(
    code: string,
    updateStatDto: UpdateClassroomDto,
  ): Promise<Classroom>;
  abstract remove(code: string): Promise<void>;
}

export const CLASSROOM_REPOSITORY_TOKEN = 'CLASSROOM_REPOSITORY_TOKEN';
