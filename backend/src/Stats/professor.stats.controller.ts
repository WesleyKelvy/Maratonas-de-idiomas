import {
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ProfessorStats, Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import {
  AbstractProfessorStatsService,
  PROFESSOR_STATS_SERVICE_TOKEN,
} from 'src/Stats/abstract-services/abstract-professor-stats.service';

@UseGuards(RolesGuard)
@Controller('professor-stats')
export class ProfessorStatsController {
  constructor(
    @Inject(PROFESSOR_STATS_SERVICE_TOKEN)
    private readonly professorStatsService: AbstractProfessorStatsService,
  ) {}
  // @Post()
  // @HttpCode(HttpStatus.CREATED)
  // create(@Body() id: string): Promise<ProfessorStats> {
  //   return this.professorStatsService.create(id);
  // }

  @Roles(Role.Professor)
  @Get('user/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ProfessorStats> {
    // Use ParseUUIDPipe
    return this.professorStatsService.findOne(id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Body() updateStatDto: UpdateProfessorStatsDto,
  // ): Promise<ProfessorStats> {
  //   return this.professorStatsService.update(id, updateStatDto);
  // }

  // @Delete(':id')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
  //   return this.professorStatsService.remove(id);
  // }
}
