import { Injectable } from '@nestjs/common';
import { AiFeedbacks, Prisma } from '@prisma/client';
import { AiFeedback } from 'src/AiFeedback/types/aiFeedback.type';
import { PrismaService } from 'src/prisma/prisma.service';
import { AbstractAiFeedbackRepository } from 'src/repositories/abstract/aiFeedback.repository';

@Injectable()
export class PrismaAiFeedbackRepository
  implements AbstractAiFeedbackRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async saveFeedbacks(
    dto: AiFeedback[],
    submissionId: string,
    marathonId: string,
  ): Promise<void> {
    const dataToCreate: Prisma.AiFeedbacksCreateManyInput[] = dto.map(
      (feedback) => ({
        submissionId: submissionId,
        explanation: feedback.explanation,
        points_deducted: feedback.pointsDeducted,
        marathon_id: marathonId,
        category: feedback.category,
      }),
    );

    await this.prisma.aiFeedbacks.createMany({
      data: dataToCreate,
      // skipDuplicates: true,
    });
  }

  async findOne(id: number): Promise<AiFeedbacks | null> {
    return await this.prisma.aiFeedbacks.findUnique({
      where: { id },
    });
  }

  async findAllBySubmissionId(submissionId: string): Promise<AiFeedbacks[]> {
    return await this.prisma.aiFeedbacks.findMany({
      where: { submissionId },
      orderBy: { id: 'asc' },
    });
  }

  async findAllByMarathonId(marathonId: string): Promise<AiFeedbacks[]> {
    return await this.prisma.aiFeedbacks.findMany({
      where: { marathon_id: marathonId },
      // orderBy: { id: 'asc' },
    });
  }
}
