import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Classroom } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ProfessorGuard } from 'src/auth/guards/professor.guard';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import {
  AbstractClassroomService,
  CLASSROOM_SERVICE_TOKEN,
} from 'src/Classroom/abstract-services/abstract-classrom.service';
import { CreateClassroomDto } from 'src/Classroom/dto/classroom.create.dto';
import { UpdateClassroomDto } from 'src/Classroom/dto/classroom.update.dto';

@UseGuards(ProfessorGuard)
@Controller('classroom')
export class ClassroomController {
  constructor(
    @Inject(CLASSROOM_SERVICE_TOKEN)
    private readonly classroomService: AbstractClassroomService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateClassroomDto,
    @CurrentUser() user: UserFromJwt,
  ): Promise<Classroom> {
    return this.classroomService.create(dto, user.id);
  }

  @Get()
  findAllByUserId(@CurrentUser() user: UserFromJwt): Promise<Classroom[]> {
    return this.classroomService.findAllByUserId(user.id);
  }

  @Get(':code')
  findOne(@Param('code') code: string): Promise<Classroom> {
    return this.classroomService.findOne(code);
  }

  @Patch(':code')
  update(
    @Param('code') code: string,
    @Body() updateDto: UpdateClassroomDto,
  ): Promise<Classroom> {
    return this.classroomService.update(code, updateDto);
  }

  @Delete(':code')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) code: string): Promise<void> {
    return this.classroomService.remove(code);
  }
}
