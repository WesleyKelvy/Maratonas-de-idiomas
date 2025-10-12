import { Injectable } from '@nestjs/common';
import { LanguageMarathon } from '@prisma/client';
import { CreateLanguageMarathonDto } from 'src/LanguageMarathon/dto/language-marathon.create.dto';
import { UpdateLanguageMarathonDto } from 'src/LanguageMarathon/dto/language-marathon.update.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AbstractLanguageMarathonRepository } from 'src/repositories/abstract/languageMarathon.repository';

@Injectable()
export class PrismaLanguageMarathonRepository
  implements AbstractLanguageMarathonRepository
{
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Finds all marathons for a given classroom code
   */
  async findAllByClassroom(id: string): Promise<LanguageMarathon[]> {
    return this.prisma.languageMarathon.findMany({
      where: { classroom_id: id },
      include: { enrollments: { select: { user_id: true } } },
    });
  }

  /**
   * Creates a new language marathon for a classroom
   */
  async create(
    dto: CreateLanguageMarathonDto,
    id: string,
    professorId: string,
    code: string,
  ): Promise<LanguageMarathon> {
    return this.prisma.languageMarathon.create({
      data: {
        code,
        title: dto.title,
        description: dto.description,
        context: dto.context,
        difficulty: dto.difficulty,
        timeLimit: dto.timeLimit,
        start_date: dto.startDate,
        end_date: dto.endDate,
        number_of_questions: dto.number_of_questions,
        classroom: { connect: { id } },
        created_by: professorId,
      },
    });
  }

  /**
   * Finds a single marathon by its ID
   */
  async findOneById(id: string): Promise<LanguageMarathon | null> {
    return this.prisma.languageMarathon.findUnique({
      where: { id },
      include: {
        classroom: {
          select: { creator: { select: { name: true } } },
        },
      },
    });
  }

  async findOneByIdWithQuestions(id: string): Promise<LanguageMarathon | null> {
    return this.prisma.languageMarathon.findUnique({
      where: { id },
      include: {
        classroom: {
          select: { creator: { select: { name: true } } },
        },
        questions: { omit: { marathon_id: true } },
      },
    });
  }

  /**
   * Finds a single marathon by its ID
   */
  async findOneByCode(code: string): Promise<LanguageMarathon | null> {
    return this.prisma.languageMarathon.findFirst({
      where: { code },
    });
  }

  /**
   * Updates a marathon by its ID
   */
  async update(
    id: string,
    dto: UpdateLanguageMarathonDto,
    userId: string,
  ): Promise<LanguageMarathon> {
    return this.prisma.languageMarathon.update({
      where: { id, created_by: userId },
      data: {
        title: dto.title,
        description: dto.description,
        context: dto.context,
        difficulty: dto.difficulty,
        timeLimit: dto.timeLimit,
        start_date: dto.startDate,
        end_date: dto.endDate,
      },
    });
  }

  /**
   * Removes a marathon by its ID
   */
  async remove(id: string, userId: string): Promise<void> {
    await this.prisma.languageMarathon.delete({
      where: { id, created_by: userId },
    });
  }

  async findAllByUserId(id: string): Promise<LanguageMarathon[]> {
    return this.prisma.languageMarathon.findMany({
      where: { created_by: id },
    });
  }
}
