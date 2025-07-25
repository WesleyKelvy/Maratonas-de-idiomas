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
  async findAllByClassroomCode(code: string): Promise<LanguageMarathon[]> {
    return this.prisma.languageMarathon.findMany({
      where: { classroom_code: code },
    });
  }

  /**
   * Creates a new language marathon for a classroom
   */
  async create(
    dto: CreateLanguageMarathonDto,
    code: string,
  ): Promise<LanguageMarathon> {
    return this.prisma.languageMarathon.create({
      data: {
        title: dto.title,
        description: dto.description,
        context: dto.context,
        difficulty: dto.difficulty,
        timeLimit: dto.timeLimit,
        start_date: dto.startDate,
        end_date: dto.endDate,
        number_of_questions: dto.number_of_questions,
        classroom: { connect: { code } },
      },
    });
  }

  /**
   * Finds a single marathon by its ID
   */
  async findOne(id: string): Promise<LanguageMarathon | null> {
    return this.prisma.languageMarathon.findUnique({
      where: { id },
    });
  }

  /**
   * Updates a marathon by its ID
   */
  async update(
    id: string,
    dto: UpdateLanguageMarathonDto,
  ): Promise<LanguageMarathon> {
    return this.prisma.languageMarathon.update({
      where: { id },
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
  async remove(id: string): Promise<void> {
    await this.prisma.languageMarathon.delete({ where: { id } });
  }
}
