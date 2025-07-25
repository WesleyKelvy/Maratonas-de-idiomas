import { Injectable, NotFoundException } from '@nestjs/common';
import { Question } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AbstractQuestionRepository } from 'src/repositories/abstract/question.repository';
import { CreateQuestionDto } from 'src/Question/dto/question.create.dto';
import { UpdateQuestionDto } from 'src/Question/dto/question.update.dto';

@Injectable()
export class PrismaQuestionRepository implements AbstractQuestionRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns all questions for a given marathon
   */
  async findAllByMarathonId(marathonId: string): Promise<Question[]> {
    return this.prisma.question.findMany({
      where: { marathon_id: marathonId },
      orderBy: { order: 'asc' },
    });
  }

  /**
   * Creates a new question under a marathon
   */
  async create(marathonId: string, dto: CreateQuestionDto): Promise<Question> {
    return this.prisma.question.create({
      data: {
        marathon: { connect: { id: marathonId } },
        title: dto.title,
        prompt_text: dto.textOfTheQuestion,
        order: dto.orderNumber,
      },
    });
  }

  /**
   * Finds a single question by its ID
   */
  async findOne(id: string): Promise<Question | null> {
    return this.prisma.question.findUnique({
      where: { id },
    });
  }

  /**
   * Updates a question by its ID
   */
  async update(id: string, dto: UpdateQuestionDto): Promise<Question> {
    // Verify existence
    const existing = await this.prisma.question.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Question with ID ${id} not found.`);
    }
    return this.prisma.question.update({
      where: { id },
      data: {
        title: dto.title,
        prompt_text: dto.textOfTheQuestion,
        order: dto.orderNumber,
      },
    });
  }

  /**
   * Removes a question by its ID
   */
  async remove(id: string): Promise<void> {
    // Verify existence
    const existing = await this.prisma.question.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Question with ID ${id} not found.`);
    }
    await this.prisma.question.delete({ where: { id } });
  }
}
