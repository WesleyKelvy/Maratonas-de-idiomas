import { Injectable } from '@nestjs/common';
import { CreateClassroomDto } from 'src/Classroom/dto/classroom.create.dto';
import { UpdateClassroomDto } from 'src/Classroom/dto/classroom.update.dto';
import {
  Classroom,
  ClassroomWithMarathonIds,
  ClassroomWithMarathonsAndEnrollments,
} from 'src/Classroom/entities/classroom.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { AbstractClassroomRepository } from 'src/repositories/abstract/classroom.repository';

@Injectable()
export class PrismaClassroomRepository implements AbstractClassroomRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find a single classroom by its marathonId
   */
  async findClassroomByMarathonId(
    marathonId: string,
  ): Promise<Classroom | null> {
    return await this.prisma.classroom.findFirst({
      where: { marathons: { every: { id: marathonId } } },
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

  async findClassroom(
    id: string,
  ): Promise<ClassroomWithMarathonsAndEnrollments | null> {
    return await this.prisma.classroom.findUnique({
      where: { id },
    });
  }

  async findClassroomWithMarathonsIds(
    id: string,
  ): Promise<ClassroomWithMarathonIds | null> {
    return await this.prisma.classroom.findUnique({
      where: { id },
      include: {
        marathons: {
          omit: { classroom_id: true },
        },
      },
    });
  }

  /**
   * Finds a single classroom by its code
   */
  async findClassroomWithMarathonsAndEnrollments(
    id: string,
  ): Promise<ClassroomWithMarathonsAndEnrollments | null> {
    return await this.prisma.classroom.findUnique({
      where: { id },
      include: {
        marathons: {
          include: { enrollments: { select: { id: true } } },
          omit: { classroom_id: true },
        },
      },
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
   * Removes a classroom by id
   */
  async remove(id: string): Promise<void> {
    await this.prisma.classroom.delete({ where: { id } });
  }
}
