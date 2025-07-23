import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentStatsDto } from 'src/stats/dto/student.create-stats.dto copy';

export class UpdateProfessorStatsDto extends PartialType(
  CreateStudentStatsDto,
) {}
