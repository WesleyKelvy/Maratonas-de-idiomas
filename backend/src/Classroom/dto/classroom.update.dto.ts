import { PartialType } from '@nestjs/mapped-types';
import { CreateClassroomDto } from 'src/Classroom/dto/classroom.create.dto';

export class UpdateClassroomDto extends PartialType(CreateClassroomDto) {}
