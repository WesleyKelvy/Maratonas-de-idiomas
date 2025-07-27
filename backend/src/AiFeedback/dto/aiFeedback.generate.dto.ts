import { IsString } from 'class-validator';

export class GenerateAiFeedbackDto {
  @IsString()
  question: string;

  @IsString()
  studentAnswer: string;
}
