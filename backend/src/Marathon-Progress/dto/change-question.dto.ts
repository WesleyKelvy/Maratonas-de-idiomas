import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ChangeQuestionDto {
  @IsString()
  @IsNotEmpty()
  marathonId: string;

  @IsNumber()
  questionId: number;
}
