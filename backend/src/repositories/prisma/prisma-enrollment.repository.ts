import { Injectable } from '@nestjs/common';
import { Enrollment } from '@prisma/client';
import { EnrollmentWithMarathons } from 'src/Enrollment/entities/enrollment.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { AbstractEnrollmentRepository } from 'src/repositories/abstract/enrollment.repository';

@Injectable()
export class PrismaEnrollmentRepository
  implements AbstractEnrollmentRepository
{
  constructor(private readonly prisma: PrismaService) {}
  async findOne(code: string, userId: string): Promise<Enrollment | null> {
    return await this.prisma.enrollment.findFirst({
      where: { user_id: userId, marathon_code: code },
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

  async findAllByUserId(userId: string): Promise<EnrollmentWithMarathons[]> {
    return await this.prisma.enrollment.findMany({
      where: { user_id: userId },
      select: {
        id: true,
        marathon: {
          select: {
            id: true,
            title: true,
            description: true,
            difficulty: true,
            start_date: true,
            end_date: true,
            number_of_questions: true,
            timeLimit: true,
            code: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async create(
    userId: string,
    marathonId: string,
    code: string,
  ): Promise<Enrollment> {
    return await this.prisma.enrollment.create({
      data: {
        marathon_code: code,
        marathon: {
          connect: { id: marathonId },
        },
        user: {
          connect: { id: userId },
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
