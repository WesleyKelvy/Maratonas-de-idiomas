import { Classroom } from '@prisma/client';
import { CreateClassroomDto } from 'src/Classroom/dto/classroom.create.dto';
import { UpdateClassroomDto } from 'src/Classroom/dto/classroom.update.dto';

export abstract class AbstractClassroomService {
  abstract create(
    dto: CreateClassroomDto,
    userName: string,
  ): Promise<Classroom>;
  abstract findOne(id: string): Promise<Classroom>;
  abstract findAllByUserId(id: string): Promise<Classroom[]>;
  abstract findOneByMarathonId(id: string): Promise<Classroom>;
  abstract update(
    code: string,
    updateStatsDto: UpdateClassroomDto,
  ): Promise<Classroom>;
  abstract remove(id: string): Promise<void>;
}

export const CLASSROOM_SERVICE_TOKEN = 'CLASSROOM_SERVICE_TOKEN';
