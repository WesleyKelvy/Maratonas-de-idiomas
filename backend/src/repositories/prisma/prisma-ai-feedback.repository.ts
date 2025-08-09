import { Injectable } from '@nestjs/common';
import { AiFeedbacks, Prisma } from '@prisma/client';
import { SaveAiFeedbackDto } from 'src/AiFeedback/dto/aiFeedback.save.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AbstractAiFeedbackRepository } from 'src/repositories/abstract/aiFeedback.repository';

@Injectable()
export class PrismaAiFeedbackRepository
  implements AbstractAiFeedbackRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async saveFeedbacks(
    dto: SaveAiFeedbackDto[],
    submissionId: string,
    marathonId: string,
  ): Promise<void> {
    const dataToCreate: Prisma.AiFeedbacksCreateManyInput[] = dto.map(
      (feedbackDto) => ({
        submissionId: submissionId,
        explanation: feedbackDto.explanation,
        points_deducted: feedbackDto.pointsDeducted,
        marathon_id: marathonId,
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
