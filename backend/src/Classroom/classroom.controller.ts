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
import { Role } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import {
  AbstractClassroomService,
  CLASSROOM_SERVICE_TOKEN,
} from 'src/Classroom/abstract-services/abstract-classrom.service';
import { CreateClassroomDto } from 'src/Classroom/dto/classroom.create.dto';
import { UpdateClassroomDto } from 'src/Classroom/dto/classroom.update.dto';
import {
  Classroom,
  ClassroomWithMarathonIds,
} from 'src/Classroom/entities/classroom.entity';

@Controller('classroom')
export class ClassroomController {
  constructor(
    @Inject(CLASSROOM_SERVICE_TOKEN)
    private readonly classroomService: AbstractClassroomService,
  ) {}

  @UseGuards(RolesGuard)
  @Roles(Role.Professor)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateClassroomDto,
    @CurrentUser() user: UserFromJwt,
  ): Promise<Classroom> {
    return this.classroomService.create(dto, user.id);
  }

  @Get()
  findAllByUserId(
    @CurrentUser() user: UserFromJwt,
  ): Promise<ClassroomWithMarathonIds[]> {
    return this.classroomService.findAllByUserId(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ClassroomWithMarathonIds> {
    return this.classroomService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Professor)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') classroomId: string,
    @Body() updateDto: UpdateClassroomDto,
    @CurrentUser() user: UserFromJwt,
  ): Promise<Classroom> {
    return this.classroomService.update(classroomId, updateDto, user.id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Professor)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @CurrentUser() user: UserFromJwt,
    @Param('id') code: string,
  ): Promise<void> {
    return this.classroomService.remove(code, user.id);
  }
}
