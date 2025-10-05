import { Injectable } from '@nestjs/common';
import {
  CreateMarathonProgress,
  MarathonProgressData,
  UpdateMarathonProgress,
} from 'src/Marathon-Progress/types/marathon-progress.type';
import { PrismaService } from 'src/prisma/prisma.service';
import { AbstractMarathonProgressRepository } from 'src/repositories/abstract/marathon-progress.repository';

@Injectable()
export class PrismaMarathonProgressRepository extends AbstractMarathonProgressRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: CreateMarathonProgress): Promise<MarathonProgressData> {
    return await this.prisma.marathonProgress.create({
      data: {
        ...data,
        draft_answer: '',
      },
    });
  }

  async findByUserAndMarathon(
    userId: string,
    marathonId: string,
  ): Promise<MarathonProgressData | null> {
    return await this.prisma.marathonProgress.findUnique({
      where: {
        user_id_marathon_id: {
          user_id: userId,
          marathon_id: marathonId,
        },
      },
    });
  }

  async update(
    id: string,
    data: UpdateMarathonProgress,
  ): Promise<MarathonProgressData> {
    return await this.prisma.marathonProgress.update({
      where: { id },
      data: {
        ...data,
        last_updated_at: new Date(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.marathonProgress.delete({
      where: { id },
    });
  }
}
