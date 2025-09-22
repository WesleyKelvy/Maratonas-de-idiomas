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
import { LanguageMarathon, Role } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import {
  AbstractLanguageMarathonService,
  LANGUAGE_MARATHON_SERVICE_TOKEN,
} from 'src/LanguageMarathon/abstract-services/abstract-language-marathon.service';
import { CreateLanguageMarathonDto } from 'src/LanguageMarathon/dto/language-marathon.create.dto';
import { UpdateLanguageMarathonDto } from 'src/LanguageMarathon/dto/language-marathon.update.dto';

@UseGuards(RolesGuard)
@Roles(Role.Professor)
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
    @CurrentUser('id') id: string,
  ): Promise<LanguageMarathon> {
    return this.marathonService.create(dto, code, id);
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
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateLanguageMarathonDto,
    @CurrentUser('id') userId: string,
  ): Promise<LanguageMarathon> {
    return this.marathonService.update(id, updateDto, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ): Promise<void> {
    return this.marathonService.remove(id, userId);
  }
}
