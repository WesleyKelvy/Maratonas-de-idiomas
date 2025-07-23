import { Injectable } from '@nestjs/common';
import { ProfessorStats as PrismaProfessorStats } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AbstractProfessorStatsRepository } from 'src/repositories/abstract/professor-stats.repository';
import { UpdateStudentStatsDto } from 'src/stats/dto/student.update-stats.dto copy';

@Injectable()
export class PrismaProfessorStatsRepository
  implements AbstractProfessorStatsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(id: string): Promise<PrismaProfessorStats> {
    return await this.prisma.professorStats.create({
      data: {
        user: {
          connect: { id },
        },
      },
    });
  }

  async findByUserId(userId: string): Promise<PrismaProfessorStats | null> {
    return await this.prisma.professorStats.findUnique({
      where: { userId: userId },
    });
  }

  async update(
    id: string,
    updateStatDto: UpdateStudentStatsDto,
  ): Promise<PrismaProfessorStats> {
    return await this.prisma.professorStats.update({
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
