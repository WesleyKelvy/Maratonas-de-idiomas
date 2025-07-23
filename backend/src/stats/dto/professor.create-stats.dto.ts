import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateProfessorStatsDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsInt()
  @Min(0)
  total_classes: number;

  @IsInt()
  @Min(0)
  total_marathons: number;

  @IsInt()
  @Min(0)
  total_students_reached: number;
}
