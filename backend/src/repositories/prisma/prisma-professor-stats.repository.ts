import { Injectable } from '@nestjs/common';
import { ProfessorStats } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AbstractProfessorStatsRepository } from 'src/repositories/abstract/professor-stats.repository';
import { UpdateProfessorStatsDto } from 'src/Stats/dto/professor.update-stats.dto';

@Injectable()
export class PrismaProfessorStatsRepository
  implements AbstractProfessorStatsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(id: string): Promise<Omit<ProfessorStats, 'userId'>> {
    return await this.prisma.professorStats.create({
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
  ): Promise<Omit<ProfessorStats, 'userId'> | null> {
    return await this.prisma.professorStats.findUnique({
      where: { userId: userId },
      omit: { userId: true },
    });
  }

  async update(
    id: string,
    updateStatDto: UpdateProfessorStatsDto,
  ): Promise<Omit<ProfessorStats, 'userId'>> {
    return await this.prisma.professorStats.update({
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

  async incrementClasses(userId: string): Promise<void> {
    await this.prisma.professorStats.update({
      where: { userId },
      data: { total_classes: { increment: 1 } },
    });
  }

  async incrementMarathons(userId: string): Promise<void> {
    await this.prisma.professorStats.update({
      where: { userId },
      data: { total_marathons: { increment: 1 } },
    });
  }

  async incrementStudentsReached(userId: string): Promise<void> {
    await this.prisma.professorStats.update({
      where: { userId },
      data: { total_students_reached: { increment: 1 } },
    });
  }
}
