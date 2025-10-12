import { CreateClassroomDto } from 'src/Classroom/dto/classroom.create.dto';
import { UpdateClassroomDto } from 'src/Classroom/dto/classroom.update.dto';
import {
  Classroom,
  ClassroomWithMarathonIds,
} from 'src/Classroom/entities/classroom.entity';

export abstract class AbstractClassroomRepository {
  abstract create(dto: CreateClassroomDto, userId: string): Promise<Classroom>;
  abstract findById(id: string): Promise<ClassroomWithMarathonIds | null>;
  abstract findOneByMarathonId(id: string): Promise<Classroom | null>;
  abstract findAllByUserId(
    userId: string,
  ): Promise<ClassroomWithMarathonIds[] | null>;
  abstract update(
    code: string,
    updateStatDto: UpdateClassroomDto,
    userId: string,
  ): Promise<Classroom>;
  abstract remove(code: string, userId: string): Promise<void>;
}

export const CLASSROOM_REPOSITORY_TOKEN = 'CLASSROOM_REPOSITORY_TOKEN';
