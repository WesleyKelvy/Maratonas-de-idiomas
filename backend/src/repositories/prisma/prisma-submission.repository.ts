import { Injectable } from '@nestjs/common';
import { Prisma, Submission } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AbstractSubmissionRepository } from 'src/repositories/abstract/submission.repository';
import { CreateSubmissionDto } from 'src/Submission/dto/submission.create.dto';
import { UpdateSubmissionDto } from 'src/Submission/dto/submission.update.dto';

@Injectable()
export class PrismaSubmissionRepository
  implements AbstractSubmissionRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(
    dto: CreateSubmissionDto,
    questionId: string,
    userId: string,
  ): Promise<Submission> {
    const data: Prisma.SubmissionCreateInput = {
      answer: dto.answer,
      question: {
        connect: { id: parseInt(questionId) },
      },
      user: {
        connect: { id: userId },
      },
    };

    const createdSubmission = await this.prisma.submission.create({
      data,
    });
    return createdSubmission;
  }

  async findOne(id: string): Promise<Submission | null> {
    return this.prisma.submission.findUnique({
      where: { id },
    });
  }

  async findAllByUserId(userId: string): Promise<Submission[]> {
    return this.prisma.submission.findMany({
      where: { user_id: userId },
    });
  }

  async update(dto: UpdateSubmissionDto, submissionId: string): Promise<void> {
    const data: Prisma.SubmissionUpdateInput = {
      corrected_answer: dto.correctedAnswer,
      score: dto.score,
      corrected_by_ai: dto.correctedAnswer ? true : undefined,
    };

    await this.prisma.submission.update({
      where: { id: submissionId },
      data: data,
    });
  }
}
