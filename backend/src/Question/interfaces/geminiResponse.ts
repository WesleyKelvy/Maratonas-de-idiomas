import { IsNotEmpty, IsString } from 'class-validator';

export interface GeminiResponse {
  questions: {
    title: string;
    prompt_text: string;
  }[];
}

export type QuestionArray = {
  title: string;
  prompt_text: string;
}[];

export class QuestionDto {
  @IsNotEmpty()
  @IsString()
  prompt_text: string;

  @IsNotEmpty()
  @IsString()
  title: string;
}
