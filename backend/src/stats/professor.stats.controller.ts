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
} from '@nestjs/common';
import {
  AbstractProfessorStatsService,
  PROFESSOR_STATS_SERVICE_TOKEN,
} from 'src/stats/abstract-services/abstract-professor-stats.service';
import { UpdateProfessorStatsDto } from 'src/stats/dto/professor.update-stats.dto';
import { ProfessorStats } from 'src/stats/entities/professor.stats.entity';

@Controller('professor-stats')
export class ProfessorStatsController {
  constructor(
    @Inject(PROFESSOR_STATS_SERVICE_TOKEN)
    private readonly professorStatsService: AbstractProfessorStatsService,
  ) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() id: string): Promise<ProfessorStats> {
    return this.professorStatsService.create(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ProfessorStats> {
    // Use ParseUUIDPipe
    return this.professorStatsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStatDto: UpdateProfessorStatsDto,
  ): Promise<ProfessorStats> {
    return this.professorStatsService.update(id, updateStatDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.professorStatsService.remove(id);
  }
}
