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
import { Classroom, Role } from '@prisma/client';
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

@UseGuards(RolesGuard)
@Roles(Role.Professor)
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

  @Get(':id')
  findOne(@Param('id') code: string): Promise<Classroom> {
    return this.classroomService.findOne(code);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') code: string,
    @Body() updateDto: UpdateClassroomDto,
    @CurrentUser() user: UserFromJwt,
  ): Promise<Classroom> {
    return this.classroomService.update(code, updateDto, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @CurrentUser() user: UserFromJwt,
    @Param('id') code: string,
  ): Promise<void> {
    return this.classroomService.remove(code, user.id);
  }
}
