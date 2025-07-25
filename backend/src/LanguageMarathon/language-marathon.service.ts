import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { LanguageMarathon } from '@prisma/client';
import { AbstractLanguageMarathonService } from 'src/LanguageMarathon/abstract-services/abstract-language-marathon.service';
import { CreateLanguageMarathonDto } from 'src/LanguageMarathon/dto/language-marathon.create.dto';
import { UpdateLanguageMarathonDto } from 'src/LanguageMarathon/dto/language-marathon.update.dto';
import {
  AbstractLanguageMarathonRepository,
  LANGUAGE_MARATHON_REPOSITORY_TOKEN,
} from 'src/repositories/abstract/languageMarathon.repository';

@Injectable()
export class LanguageMarathonService
  implements AbstractLanguageMarathonService
{
  constructor(
    @Inject(LANGUAGE_MARATHON_REPOSITORY_TOKEN)
    private readonly marathonRepository: AbstractLanguageMarathonRepository,
  ) {}

  async findAllByClassroomCode(code: string): Promise<LanguageMarathon[]> {
    const marathon = await this.marathonRepository.findAllByClassroomCode(code);
    if (!marathon) {
      throw new NotFoundException(
        `Marathons for this classroom does not exist.`,
      );
    }

    return marathon;
  }

  async create(
    dto: CreateLanguageMarathonDto,
    code: string,
  ): Promise<LanguageMarathon> {
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMinutes(startDate.getMinutes() + dto.timeLimit);

    return await this.marathonRepository.create(
      { ...dto, endDate: endDate, startDate },
      code,
    );
  }

  async findOne(id: string): Promise<LanguageMarathon> {
    const marathon = await this.marathonRepository.findOne(id);
    console.log(marathon);
    if (!marathon) {
      throw new NotFoundException(`Marathon with ID ${id} not found.`);
    }

    return marathon;
  }

  async update(
    id: string,
    dto: UpdateLanguageMarathonDto,
  ): Promise<LanguageMarathon> {
    const marathon = await this.marathonRepository.findOne(id);
    if (!marathon) {
      throw new NotFoundException(`Marathon with ID ${id} not found.`);
    }

    return await this.marathonRepository.update(marathon.id, dto);
  }

  async remove(id: string): Promise<void> {
    const existingClassroom =
      await this.marathonRepository.findAllByClassroomCode(id);
    if (!existingClassroom) {
      throw new NotFoundException(`Classroom with ID ${id} not found.`);
    }
    await this.marathonRepository.remove(id);
  }
}
