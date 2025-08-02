import { PartialType } from '@nestjs/mapped-types';
import { CreateProfessorStatsDto } from 'src/Stats/dto/professor.create-stats.dto';

export class UpdateProfessorStatsDto extends PartialType(
  CreateProfessorStatsDto,
) {}
