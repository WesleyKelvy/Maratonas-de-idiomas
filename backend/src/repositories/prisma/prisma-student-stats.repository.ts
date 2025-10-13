import { Injectable } from '@nestjs/common';
import { StudentStats } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AbstractStudentStatsRepository } from 'src/repositories/abstract/student-stats.repository';
import { UpdateStudentStatsDto } from 'src/Stats/dto/student.update-stats.dto copy';

@Injectable()
export class PrismaStudentStatsRepository
  implements AbstractStudentStatsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(id: string): Promise<Omit<StudentStats, 'userId'>> {
    return await this.prisma.studentStats.create({
      data: {
        user: {
          connect: { id },
        },
      },
      omit: { userId: true },
    });
  }

  async findByUserId(
    userId: string,
  ): Promise<Omit<StudentStats, 'userId'> | null> {
    return await this.prisma.studentStats.findUnique({
      where: { userId: userId },
      omit: { userId: true },
    });
  }

  async update(
    id: string,
    updateStatDto: UpdateStudentStatsDto,
  ): Promise<Omit<StudentStats, 'userId'>> {
    return await this.prisma.studentStats.update({
      where: { userId: id },
      data: updateStatDto,
      omit: { userId: true },
    });
  }

  // async remove(id: string): Promise<void> {
  //   await this.prisma.studentStats.delete({
  //     where: { userId: id },
  //   });
  // }
}
