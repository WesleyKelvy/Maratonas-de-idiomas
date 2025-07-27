import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSubmissionDto {
  @IsNotEmpty()
  @IsString()
  answer: string;
}
