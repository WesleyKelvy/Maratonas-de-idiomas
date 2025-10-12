import { IsNotEmpty, IsString } from 'class-validator';

export class CreateClassroomDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  // @Type(() => Date)
  // @IsDate()
  // invite_expiration: Date;
}
