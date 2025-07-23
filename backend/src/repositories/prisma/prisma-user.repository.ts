import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

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

  async update(
    id: string,
    updateUserDto: Prisma.UserUpdateInput,
  ): Promise<User> {
    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async findbyToken(token: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { resetToken: token },
    });
  }

  async updateByEmail(
    email: string,
    updateUserDto: Prisma.UserUpdateInput,
  ): Promise<User> {
    return await this.prisma.user.update({
      where: { email },
      data: updateUserDto,
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
}
