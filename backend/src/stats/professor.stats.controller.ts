import { Controller, Inject } from '@nestjs/common';
import {
  AbstractProfessorStatsService,
  PROFESSOR_STATS_SERVICE_TOKEN,
} from 'src/stats/abstract-services/abstract-professor-stats.service';

@Controller('professor-stats')
export class ProfessorStatsController {
  constructor(
    @Inject(PROFESSOR_STATS_SERVICE_TOKEN)
    private readonly professorStatsService: AbstractProfessorStatsService,
  ) {}
}
