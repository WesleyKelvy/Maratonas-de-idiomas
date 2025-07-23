import { Prisma, User } from '@prisma/client';

export abstract class AbstractUserRepository {
  abstract create(createUserDto: Prisma.UserCreateInput): Promise<User>;
  abstract findAll(): Promise<User[]>;
  abstract findOne(id: string): Promise<User>;
  abstract findByEmail(email: string): Promise<User>;
  abstract update(
    email: string,
    updateUserDto: Prisma.UserUpdateInput,
  ): Promise<User>;
  abstract remove(id: string): Promise<void>;
  abstract findbyToken(token: string): Promise<User>;
  abstract updateByEmail(
    email: string,
    updateUserDto: Prisma.UserUpdateInput,
  ): Promise<User>;
  abstract resetPassword(token: string, newPassword: string): Promise<void>;
}
