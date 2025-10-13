import {
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { Role, StudentStats } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import {
  AbstractStudentStatsService,
  STUDENT_STATS_SERVICE_TOKEN,
} from 'src/Stats/abstract-services/abstract-student-stats.service';

@UseGuards(RolesGuard)
@Controller('student-stats')
export class StudentStatsController {
  constructor(
    @Inject(STUDENT_STATS_SERVICE_TOKEN)
    private readonly studentStatsService: AbstractStudentStatsService,
  ) {}

  @Roles(Role.Student)
  @Get('user/:id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Omit<StudentStats, 'userId'>> {
    return this.studentStatsService.findOne(id);
  }
}
