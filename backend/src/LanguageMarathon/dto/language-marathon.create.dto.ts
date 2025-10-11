import { Difficulty } from '@prisma/client';
import { Transform } from 'class-transformer';
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

  @IsOptional()
  @IsString()
  description: string;

  @IsString()
  @IsNotEmpty()
  context: string;

  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @IsInt()
  timeLimit: number;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : value))
  @IsDate()
  startDate: Date;

  @IsOptional()
  @IsDate()
  endDate: Date;

  @IsNumber()
  @IsNotEmpty()
  number_of_questions: number;
}
