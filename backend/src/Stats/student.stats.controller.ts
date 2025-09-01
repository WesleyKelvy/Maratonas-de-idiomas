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
import { Role, StudentStats } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import {
  AbstractStudentStatsService,
  STUDENT_STATS_SERVICE_TOKEN,
} from 'src/Stats/abstract-services/abstract-student-stats.service';
import { UpdateStudentStatsDto } from 'src/Stats/dto/student.update-stats.dto copy';

@UseGuards(RolesGuard)
@Roles(Role.Student)
@Controller('student-stats')
export class StudentStatsController {
  constructor(
    @Inject(STUDENT_STATS_SERVICE_TOKEN)
    private readonly studentStatsService: AbstractStudentStatsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() id: string): Promise<StudentStats> {
    return this.studentStatsService.create(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<StudentStats> {
    return this.studentStatsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStatDto: UpdateStudentStatsDto,
  ): Promise<StudentStats> {
    return this.studentStatsService.update(id, updateStatDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.studentStatsService.remove(id);
  }
}
