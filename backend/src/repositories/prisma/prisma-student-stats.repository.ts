import { Injectable } from '@nestjs/common';
import { StudentStats as PrismaStudentStats } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AbstractStudentStatsRepository } from 'src/repositories/abstract/student-stats.repository';
import { UpdateStudentStatsDto } from 'src/Stats/dto/student.update-stats.dto copy';

@Injectable()
export class PrismaStudentStatsRepository
  implements AbstractStudentStatsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(id: string): Promise<PrismaStudentStats> {
    return await this.prisma.studentStats.create({
      data: {
        user: {
          connect: { id },
        },
      },
    });
  }

  async findByUserId(userId: string): Promise<PrismaStudentStats | null> {
    return await this.prisma.studentStats.findUnique({
      where: { userId: userId },
    });
  }

  async update(
    id: string,
    updateStatDto: UpdateStudentStatsDto,
  ): Promise<PrismaStudentStats> {
    return await this.prisma.studentStats.update({
      where: { userId: id },
      data: updateStatDto,
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.studentStats.delete({
      where: { userId: id },
    });
  }
}
