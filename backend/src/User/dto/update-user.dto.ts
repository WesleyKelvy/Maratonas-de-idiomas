import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsBoolean()
  accountVerified: boolean;

  @IsString()
  @IsOptional()
  resetToken: string;

  @IsDate()
  @IsOptional()
  resetTokenExpiration: Date;

  @IsOptional()
  @IsString()
  confirmationCode: string;

  @IsOptional()
  @IsDate()
  resetRequestedAt: Date;
}
