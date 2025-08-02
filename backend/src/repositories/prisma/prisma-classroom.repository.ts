import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Classroom } from '@prisma/client';
import { AbstractClassroomRepository } from 'src/repositories/abstract/classroom.repository';
import { CreateClassroomDto } from 'src/Classroom/dto/classroom.create.dto';
import { UpdateClassroomDto } from 'src/Classroom/dto/classroom.update.dto';

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
  async findAll(userId: string): Promise<Classroom[]> {
    return await this.prisma.classroom.findMany({
      where: { created_by: userId },
    });
  }

  /**
   * Creates a new classroom with the given data
   */
  async create(
    dto: CreateClassroomDto,
    code: string,
    userId: string,
  ): Promise<Classroom> {
    return await this.prisma.classroom.create({
      data: {
        name: dto.name,
        code: code,
        invite_expiration: dto.invite_expiration,
        creator: {
          connect: { id: userId },
        },
      },
    });
  }

  /**
   * Finds a single classroom by its id
   */
  async findByCode(code: string): Promise<Classroom | null> {
    return await this.prisma.classroom.findUnique({
      where: { code },
    });
  }

  /**
   * Updates classroom properties by code
   */
  async update(code: string, dto: UpdateClassroomDto): Promise<Classroom> {
    // Ensure classroom exists
    const existing = await this.prisma.classroom.findUnique({
      where: { code },
    });
    if (!existing) {
      throw new NotFoundException(`Classroom with code ${code} not found.`);
    }
    return await this.prisma.classroom.update({
      where: { code },
      data: {
        name: dto.name,
        code: code,
        invite_expiration: dto.invite_expiration,
      },
    });
  }

  /**
   * Removes a classroom by id
   */
  async remove(code: string): Promise<void> {
    const existing = await this.prisma.classroom.findUnique({
      where: { code },
    });
    if (!existing) {
      throw new NotFoundException(`Classroom with code ${code} not found.`);
    }

    await this.prisma.classroom.delete({ where: { code } });
  }
}
