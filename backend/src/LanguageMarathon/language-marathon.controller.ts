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
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import {
  AbstractLanguageMarathonService,
  LANGUAGE_MARATHON_SERVICE_TOKEN,
} from 'src/LanguageMarathon/abstract-services/abstract-language-marathon.service';
import { CreateLanguageMarathonDto } from 'src/LanguageMarathon/dto/language-marathon.create.dto';
import { UpdateLanguageMarathonDto } from 'src/LanguageMarathon/dto/language-marathon.update.dto';
import {
  CustomLanguageMarathon,
  RecentMarathonsAndUserStats,
} from 'src/LanguageMarathon/entities/language-marathon.entity';

@Controller('marathon')
export class LanguageMarathonController {
  constructor(
    @Inject(LANGUAGE_MARATHON_SERVICE_TOKEN)
    private readonly marathonService: AbstractLanguageMarathonService,
  ) {}

  @Get('/classroom/:id')
  findAllByClassroomId(@Param('id') id: string): Promise<LanguageMarathon[]> {
    return this.marathonService.findAllByClassroomId(id);
  }

  @Get('/user')
  findAllByUserId(
    @CurrentUser('id') userId: string,
  ): Promise<LanguageMarathon[]> {
    return this.marathonService.findAllByUserId(userId);
  }

  @Get('/ids-and-titles') // Only gets finished marathons for displaing ranking. PROFESSOR
  findAllIdsAndTitle(
    @CurrentUser('id') id: string,
  ): Promise<CustomLanguageMarathon[]> {
    return this.marathonService.findAllIdsAndTitle(id);
  }

  @Get('/recent-marathons')
  findRecentMarathonsAndUserStats(
    @CurrentUser() user: UserFromJwt,
  ): Promise<RecentMarathonsAndUserStats> {
    return this.marathonService.findRecentMarathonsAndUserStats(
      user.id,
      user.role,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<LanguageMarathon> {
    return this.marathonService.findOneById(id);
  }

  @Get('code/:code') //  marathon-enrollment screen
  findOneByCode(@Param('code') code: string): Promise<LanguageMarathon> {
    return this.marathonService.findOneByCode(code);
  }

  @Get(':id/with-questions')
  findOneByIdWithQuestions(@Param('id') id: string): Promise<LanguageMarathon> {
    return this.marathonService.findOneByIdWithQuestions(id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Professor)
  @Post('classroom/:id')
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateLanguageMarathonDto,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ): Promise<LanguageMarathon> {
    return this.marathonService.create(dto, id, userId);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Professor)
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
