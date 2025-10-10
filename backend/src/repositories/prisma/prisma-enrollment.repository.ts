import { Injectable } from '@nestjs/common';
import { Enrollment } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AbstractEnrollmentRepository } from 'src/repositories/abstract/enrollment.repository';

@Injectable()
export class PrismaEnrollmentRepository
  implements AbstractEnrollmentRepository
{
  constructor(private readonly prisma: PrismaService) {}
  async findOne(
    marathonId: string,
    userId: string,
  ): Promise<Enrollment | null> {
    return await this.prisma.enrollment.findFirst({
      where: { user_id: userId, marathon_id: marathonId },
    });
  }

  async findAllEnrollmentsByMarathonId(
    marathonId: string,
  ): Promise<Enrollment[]> {
    return await this.prisma.enrollment.findMany({
      where: { marathon_id: marathonId },
      include: {
        marathon: true,
      },
    });
  }

  async findAllByUserId(userId: string): Promise<Enrollment[]> {
    return await this.prisma.enrollment.findMany({
      where: { user_id: userId },
      include: {
        marathon: true,
      },
    });
  }

  async create(
    marathonId: string,
    userId: string,
    code: string,
  ): Promise<Enrollment> {
    return await this.prisma.enrollment.create({
      data: {
        marathon_code: code,
        user: {
          connect: { id: userId },
        },
        marathon: {
          connect: { id: marathonId },
        },
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.enrollment.delete({
      where: { id },
    });
  }

  async findById(id: string): Promise<Enrollment | null> {
    return await this.prisma.enrollment.findUnique({
      where: { id },
    });
  }
}
