import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

export interface GeminiResponse {
  questions: {
    question_text: string;
  }[];
}

export type QuestionArray = {
  question_text: string;
}[];

export class SingleQuestionDto {
  @IsString()
  question_text: string;
}

export class QuestionArrayDto {
  @ValidateNested({ each: true })
  @Type(() => SingleQuestionDto)
  questions: SingleQuestionDto[];
}
