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

  // @Post()
  // @HttpCode(HttpStatus.CREATED)
  // create(@Body() id: string): Promise<StudentStats> {
  //   return this.studentStatsService.create(id);
  // }

  @Roles(Role.Student)
  @Get('user/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<StudentStats> {
    return this.studentStatsService.findByUserId(id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Body() updateStatDto: UpdateStudentStatsDto,
  // ): Promise<StudentStats> {
  //   return this.studentStatsService.update(id, updateStatDto);
  // }

  // @Delete(':id')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
  //   return this.studentStatsService.remove(id);
  // }
}
