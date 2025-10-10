import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEnrollmentDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}
