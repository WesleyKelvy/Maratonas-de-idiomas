import { Controller, Inject } from '@nestjs/common';
import {
  AbstractStudentStatsService,
  STUDENT_STATS_SERVICE_TOKEN,
} from 'src/stats/abstract-services/abstract-student-stats.service';

@Controller('student-stats')
export class StudentStatsController {
  constructor(
    @Inject(STUDENT_STATS_SERVICE_TOKEN)
    private readonly studentStatsService: AbstractStudentStatsService,
  ) {}
}
