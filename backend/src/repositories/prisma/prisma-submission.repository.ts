import { Injectable } from '@nestjs/common';
import { Prisma, Submission } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AbstractSubmissionRepository } from 'src/repositories/abstract/submission.repository';
import { UpdateSubmissionDto } from 'src/Submission/dto/submission.update.dto';

@Injectable()
export class PrismaSubmissionRepository
  implements AbstractSubmissionRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(
    answer: string,
    questionId: number,
    userId: string,
    marathonId: string,
  ): Promise<Submission> {
    const data: Prisma.SubmissionCreateInput = {
      answer,
      question: {
        connect: { id: questionId },
      },
      user: {
        connect: { id: userId },
      },
      marathon: { connect: { id: marathonId } },
    };

    const createdSubmission = await this.prisma.submission.create({
      data,
    });
    return createdSubmission;
  }

  async findOne(id: string): Promise<Submission | null> {
    return this.prisma.submission.findUnique({
      where: { id },
      include: {
        question: { select: { title: true, prompt_text: true } },
        user: {
          select: {
            email: true,
            name: true,
          },
        },
        AiFeedbacks: {
          select: {
            category: true,
            explanation: true,
            id: true,
            points_deducted: true,
          },
        },
      },
    });
  }

  async findAllByUserId(userId: string): Promise<Submission[]> {
    return this.prisma.submission.findMany({
      where: { user_id: userId },
    });
  }

  async findAllByMarathonId(marathonId: string): Promise<Submission[]> {
    return this.prisma.submission.findMany({
      where: { marathon_id: marathonId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
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
