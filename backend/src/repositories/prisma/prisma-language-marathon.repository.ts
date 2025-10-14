import { Injectable } from '@nestjs/common';
import { LanguageMarathon, Role } from '@prisma/client';
import { CreateLanguageMarathonDto } from 'src/LanguageMarathon/dto/language-marathon.create.dto';
import { UpdateLanguageMarathonDto } from 'src/LanguageMarathon/dto/language-marathon.update.dto';
import {
  CustomLanguageMarathon,
  RecentMarathons,
} from 'src/LanguageMarathon/entities/language-marathon.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { AbstractLanguageMarathonRepository } from 'src/repositories/abstract/languageMarathon.repository';

@Injectable()
export class PrismaLanguageMarathonRepository
  implements AbstractLanguageMarathonRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async findAllIdsAndTitle(userId: string): Promise<CustomLanguageMarathon[]> {
    return this.prisma.languageMarathon.findMany({
      where: {
        OR: [
          { created_by: userId, end_date: { lt: new Date() } },
          {
            enrollments: { some: { user_id: userId } },
            end_date: { lt: new Date() },
          },
        ],
      },
      select: {
        id: true,
        title: true,
      },
    });
  }

  /**
   * Finds recent marathons and stats for a user
   */
  async findRecentMarathons(
    userId: string,
    role: Role,
  ): Promise<RecentMarathons[]> {
    const whereClause =
      role === Role.Professor
        ? { created_by: userId }
        : { enrollments: { some: { user_id: userId } } };

    const data = await this.prisma.languageMarathon.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        difficulty: true,
        start_date: true,
        end_date: true,
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
      orderBy: {
        start_date: 'desc',
      },
      take: 3,
    });

    return data.map(({ _count, ...rest }) => ({
      ...rest,
      enrollmentsCount: _count.enrollments,
    }));
  }

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
      include: {
        classroom: { select: { creator: { select: { name: true } } } },
      },
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
