import { CreateClassroomDto } from 'src/Classroom/dto/classroom.create.dto';
import { UpdateClassroomDto } from 'src/Classroom/dto/classroom.update.dto';
import {
  Classroom,
  ClassroomWithMarathonIds,
  ClassroomWithMarathons,
} from 'src/Classroom/entities/classroom.entity';

export abstract class AbstractClassroomService {
  abstract create(
    dto: CreateClassroomDto,
    userName: string,
  ): Promise<Classroom>;
  abstract findOne(id: string): Promise<ClassroomWithMarathonIds>;
  abstract findAllByUserId(id: string): Promise<ClassroomWithMarathonIds[]>;
  abstract findOneByMarathonId(id: string): Promise<ClassroomWithMarathons>;
  abstract update(
    code: string,
    updateStatsDto: UpdateClassroomDto,
    userId: string,
  ): Promise<Classroom>;
  abstract remove(id: string, userId: string): Promise<void>;
}

export const CLASSROOM_SERVICE_TOKEN = 'CLASSROOM_SERVICE_TOKEN';
