import { Classroom } from '@prisma/client';
import { CreateClassroomDto } from 'src/Classroom/dto/classroom.create.dto';
import { UpdateClassroomDto } from 'src/Classroom/dto/classroom.update.dto';

export abstract class AbstractClassroomRepository {
  abstract create(
    dto: CreateClassroomDto,
    code: string,
    userId: string,
  ): Promise<Classroom>;
  abstract findByCode(userId: string): Promise<Classroom | null>;
  abstract findOneByMarathonId(id: string): Promise<Classroom | null>;
  abstract findAll(userId: string): Promise<Classroom[]>;
  abstract update(
    code: string,
    updateStatDto: UpdateClassroomDto,
    userId: string,
  ): Promise<Classroom>;
  abstract remove(code: string, userId: string): Promise<void>;
}

export const CLASSROOM_REPOSITORY_TOKEN = 'CLASSROOM_REPOSITORY_TOKEN';
