import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsNotEmpty()
  textOfTheQuestion: string;
}
