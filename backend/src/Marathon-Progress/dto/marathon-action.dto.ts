import { IsNotEmpty, IsString } from 'class-validator';

export class MarathonIdDto {
  @IsNotEmpty()
  @IsString()
  marathonId: string;
}
