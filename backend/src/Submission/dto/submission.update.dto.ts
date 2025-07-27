import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateSubmissionDto {
  @IsNotEmpty()
  @IsInt()
  score: number;

  @IsString()
  @IsOptional()
  correctedAnswer: string;
}
