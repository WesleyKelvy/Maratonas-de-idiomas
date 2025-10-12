import { CreateClassroomDto } from 'src/Classroom/dto/classroom.create.dto';
import { UpdateClassroomDto } from 'src/Classroom/dto/classroom.update.dto';
import {
  Classroom,
  ClassroomWithLanguageMarathon,
  ClassroomWithMarathonIds,
  ClassroomWithMarathonsAndEnrollments,
} from 'src/Classroom/entities/classroom.entity';

export abstract class AbstractClassroomService {
  abstract create(
    dto: CreateClassroomDto,
    userName: string,
  ): Promise<ClassroomWithLanguageMarathon>;
  abstract findOne(id: string): Promise<ClassroomWithMarathonsAndEnrollments>;
  abstract findAllByUserId(id: string): Promise<ClassroomWithMarathonIds[]>;
  abstract update(
    code: string,
    updateStatsDto: UpdateClassroomDto,
    userId: string,
  ): Promise<ClassroomWithLanguageMarathon>;
  abstract remove(id: string, userId: string): Promise<void>;
  abstract findClassroomByMarathonId(marathonId: string): Promise<Classroom>;
}

export const CLASSROOM_SERVICE_TOKEN = 'CLASSROOM_SERVICE_TOKEN';
