import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AbstractClassroomRepository } from 'src/repositories/abstract/classroom.repository';
import { CreateClassroomDto } from 'src/Classroom/dto/classroom.create.dto';
import { UpdateClassroomDto } from 'src/Classroom/dto/classroom.update.dto';
import {
  Classroom,
  ClassroomWithMarathonIds,
} from 'src/Classroom/entities/classroom.entity';

@Injectable()
export class PrismaClassroomRepository implements AbstractClassroomRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find a single classroom by its marathonId
   */
  async findOneByMarathonId(id: string): Promise<Classroom | null> {
    return await this.prisma.classroom.findFirst({
      where: { marathons: { every: { id } } },
    });
  }

  /**
   * Returns all classrooms created by a specific user
   */
  async findAllByUserId(
    userId: string,
  ): Promise<ClassroomWithMarathonIds[] | null> {
    return await this.prisma.classroom.findMany({
      where: { created_by: userId },
      include: { marathons: { select: { id: true } } },
    });
  }

  /**
   * Creates a new classroom with the given data
   */
  async create(dto: CreateClassroomDto, userId: string): Promise<Classroom> {
    return await this.prisma.classroom.create({
      data: {
        name: dto.name,
        // invite_expiration: dto.invite_expiration,
        creator: {
          connect: { id: userId },
        },
      },
    });
  }

  /**
   * Finds a single classroom by its code
   */
  async findById(id: string): Promise<ClassroomWithMarathonIds | null> {
    return await this.prisma.classroom.findUnique({
      where: { id },
      include: { marathons: { select: { id: true } } },
    });
  }

  /**
   * Updates classroom properties by code
   */
  async update(
    id: string,
    dto: UpdateClassroomDto,
    userId: string,
  ): Promise<Classroom> {
    return await this.prisma.classroom.update({
      where: { id, created_by: userId },
      data: {
        name: dto.name,
        // invite_expiration: dto.invite_expiration,
      },
    });
  }

  /**
   * Removes a classroom by code
   */
  async remove(id: string, userId: string): Promise<void> {
    const existing = await this.prisma.classroom.findUnique({
      where: { id, created_by: userId },
    });
    if (!existing) {
      throw new NotFoundException(`Classroom with code ${id} not found.`);
    }

    await this.prisma.classroom.delete({ where: { id } });
  }
}
