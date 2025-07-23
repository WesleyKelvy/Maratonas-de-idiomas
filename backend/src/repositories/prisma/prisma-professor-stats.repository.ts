import { Injectable } from '@nestjs/common';
import { ProfessorStats as PrismaProfessorStats } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AbstractProfessorStatsRepository } from 'src/repositories/professor-stats.repository';
import { CreateProfessorStatsDto } from 'src/stats/dto/professor.create-stats.dto';
import { UpdateStudentStatsDto } from 'src/stats/dto/student.update-stats.dto copy';

@Injectable()
export class PrismaProfessorStatsRepository
  implements AbstractProfessorStatsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createStatDto: CreateProfessorStatsDto,
  ): Promise<PrismaProfessorStats> {
    return await this.prisma.professorStats.create({
      data: {
        user: {
          connect: { id: createStatDto.userId },
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
