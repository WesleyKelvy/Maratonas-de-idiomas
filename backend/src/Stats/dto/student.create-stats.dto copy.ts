import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStudentStatsDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
