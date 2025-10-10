import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class GetUsersByIdsDto {
  @IsArray({ message: 'userIds deve ser um array' })
  @ArrayNotEmpty({ message: 'userIds não pode estar vazio' })
  @IsUUID('4', { each: true, message: 'Cada ID deve ser um UUID válido' })
  userIds: string[];
}

export class UserBasicInfoDto {
  id: string;
  name: string;
  email: string;
}
