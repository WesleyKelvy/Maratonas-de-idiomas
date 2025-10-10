import { Prisma, User } from '@prisma/client';
import { UserBasicInfoDto } from 'src/User/dto/get-users.dto';
import { UpdateUserDto } from 'src/User/dto/update-user.dto';

export abstract class AbstractUserRepository {
  abstract create(createUserDto: Prisma.UserCreateInput): Promise<User>;
  abstract findByCode(code: string): Promise<User>;
  abstract findAll(): Promise<User[]>;
  abstract findOne(id: string): Promise<User>;
  abstract findByEmail(email: string): Promise<User>;
  abstract findbyToken(token: string): Promise<User>;
  abstract updateById(
    id: string,
    updateUserDto: Partial<UpdateUserDto>,
  ): Promise<User>;
  abstract remove(id: string): Promise<void>;
  abstract resetPassword(token: string, newPassword: string): Promise<void>;
  abstract findManyByIds(userIds: string[]): Promise<UserBasicInfoDto[]>;
}

export const USER_REPOSITORY_TOKEN = 'AbstractUserRepository';
