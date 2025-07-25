import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LanguageMarathon } from '@prisma/client';
import { ProfessorGuard } from 'src/auth/guards/professor.guard';
import {
  AbstractLanguageMarathonService,
  LANGUAGE_MARATHON_SERVICE_TOKEN,
} from 'src/LanguageMarathon/abstract-services/abstract-language-marathon.service';
import { CreateLanguageMarathonDto } from 'src/LanguageMarathon/dto/language-marathon.create.dto';
import { UpdateLanguageMarathonDto } from 'src/LanguageMarathon/dto/language-marathon.update.dto';

@UseGuards(ProfessorGuard)
@Controller('/classrooms/:code/marathon')
export class LanguageMarathonController {
  constructor(
    @Inject(LANGUAGE_MARATHON_SERVICE_TOKEN)
    private readonly marathonService: AbstractLanguageMarathonService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateLanguageMarathonDto,
    @Param('code') code: string,
  ): Promise<LanguageMarathon> {
    return this.marathonService.create(dto, code);
  }

  @Get()
  findAllByClassroomCode(
    @Param('code') code: string,
  ): Promise<LanguageMarathon[]> {
    return this.marathonService.findAllByClassroomCode(code);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<LanguageMarathon> {
    return this.marathonService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateLanguageMarathonDto,
  ): Promise<LanguageMarathon> {
    return this.marathonService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.marathonService.remove(id);
  }
}
