import { CreateClassroomDto } from 'src/Classroom/dto/classroom.create.dto';
import { UpdateClassroomDto } from 'src/Classroom/dto/classroom.update.dto';
import {
  Classroom,
  ClassroomWithMarathonIds,
  ClassroomWithMarathonsAndEnrollments,
} from 'src/Classroom/entities/classroom.entity';

export abstract class AbstractClassroomRepository {
  abstract create(dto: CreateClassroomDto, userId: string): Promise<Classroom>;
  abstract findClassroomWithMarathonsAndEnrollments(
    id: string,
  ): Promise<ClassroomWithMarathonsAndEnrollments | null>;
  abstract findClassroom(id: string): Promise<Classroom | null>;
  abstract findClassroomWithMarathonsIds(
    id: string,
  ): Promise<ClassroomWithMarathonIds | null>;
  abstract findClassroomByMarathonId(
    marathonId: string,
  ): Promise<Classroom | null>;
  abstract findAllByUserId(
    userId: string,
  ): Promise<ClassroomWithMarathonIds[] | null>;
  abstract update(
    id: string,
    updateStatDto: UpdateClassroomDto,
    userId: string,
  ): Promise<Classroom>;
  abstract remove(id: string, userId: string): Promise<void>;
}

export const CLASSROOM_REPOSITORY_TOKEN = 'CLASSROOM_REPOSITORY_TOKEN';
