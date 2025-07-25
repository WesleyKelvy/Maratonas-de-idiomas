import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateQuestionDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsString()
  @IsNotEmpty()
  prompt_text: string;
}
