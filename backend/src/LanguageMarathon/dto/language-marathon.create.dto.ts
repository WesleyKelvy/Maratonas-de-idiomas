import { Difficulty } from '@prisma/client';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateLanguageMarathonDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsNotEmpty()
  context: string;

  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @IsInt()
  timeLimit: number;

  @IsDate()
  @IsOptional()
  startDate: Date;

  @IsDate()
  @IsOptional()
  endDate: Date;

  @IsNumber()
  @IsNotEmpty()
  number_of_questions: number;
}
