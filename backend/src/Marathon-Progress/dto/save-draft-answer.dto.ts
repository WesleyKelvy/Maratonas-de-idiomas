import { IsString, IsNotEmpty, MaxLength, IsNumber } from 'class-validator';

export class SaveDraftAnswerDto {
  @IsString()
  @IsNotEmpty()
  marathonId: string;

  @IsNumber()
  questionId: number;

  @IsString()
  @MaxLength(2000)
  draftAnswer: string;
}
