import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AbstractUserRepository } from 'src/repositories/abstract/user.repository';
import { UserBasicInfoDto } from 'src/User/dto/get-users.dto';
import { userAccountManagement } from 'src/User/types/userAccountManagement';

@Injectable()
export class PrismaAbstractUserRepository implements AbstractUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByCode(code: string): Promise<User> {
    return this.prisma.user.findFirst({
      where: { confirmationCode: code },
    });
  }

  async create(createUserDto: Prisma.UserCreateInput): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: createUserDto,
    });
    return createdUser;
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async updateById(
    id: string,
    updateUserDto: Prisma.UserUpdateInput,
  ): Promise<User> {
    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { accountDeactivated: true },
    });
  }

  async findbyToken(token: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { resetToken: token },
    });
  }

  async manageUserAccount(
    id: string,
    data: userAccountManagement,
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: data,
    });
  }

  async resetPassword(token: string, newPasswordHash: string): Promise<void> {
    await this.prisma.user.update({
      where: {
        resetToken: token,
      },
      data: {
        passwordHash: newPasswordHash,
        resetToken: null,
        resetTokenExpiration: null,
      },
    });
  }

  async findManyByIds(userIds: string[]): Promise<UserBasicInfoDto[]> {
    const users = await this.prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return users;
  }
}
