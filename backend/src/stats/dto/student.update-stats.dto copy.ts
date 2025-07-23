import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentStatsDto } from 'src/stats/dto/student.create-stats.dto copy';

export class UpdateStudentStatsDto extends PartialType(CreateStudentStatsDto) {}
