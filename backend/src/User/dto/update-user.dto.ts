import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, Length, Matches } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  @Length(9)
  confirmationCode: string;

  @IsOptional()
  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
    message: 'password too weak!',
  })
  newPassword: string;
}
