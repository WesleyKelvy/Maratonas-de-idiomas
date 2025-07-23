import { Module } from '@nestjs/common';
import { PROFESSOR_STATS_REPOSITORY_TOKEN } from 'src/repositories/abstract/professor-stats.repository';
import { STUDENT_STATS_REPOSITORY_TOKEN } from 'src/repositories/abstract/student-stats.repository';
import { PrismaProfessorStatsRepository } from 'src/repositories/prisma/prisma-professor-stats.repository';
import { PrismaStudentStatsRepository } from 'src/repositories/prisma/prisma-student-stats.repository';
import { PROFESSOR_STATS_SERVICE_TOKEN } from 'src/stats/abstract-services/abstract-professor-stats.service';
import { STUDENT_STATS_SERVICE_TOKEN } from 'src/stats/abstract-services/abstract-student-stats.service';
import { ProfessorStatsController } from 'src/stats/professor.stats.controller';
import { ProfessorStatsService } from 'src/stats/professor.stats.service';
import { StudentStatsController } from 'src/stats/student.stats.controller';
import { StudentStatsService } from 'src/stats/student.stats.service';

@Module({
  controllers: [StudentStatsController, ProfessorStatsController],
  providers: [
    {
      provide: STUDENT_STATS_SERVICE_TOKEN,
      useClass: StudentStatsService,
    },
    {
      provide: STUDENT_STATS_REPOSITORY_TOKEN,
      useClass: PrismaStudentStatsRepository,
    },
    {
      provide: PROFESSOR_STATS_SERVICE_TOKEN,
      useClass: ProfessorStatsService,
    },
    {
      provide: PROFESSOR_STATS_REPOSITORY_TOKEN,
      useClass: PrismaProfessorStatsRepository,
    },
  ],
  exports: [STUDENT_STATS_SERVICE_TOKEN, PROFESSOR_STATS_SERVICE_TOKEN],
})
export class StatsModule {}
