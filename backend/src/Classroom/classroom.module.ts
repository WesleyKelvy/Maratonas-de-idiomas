import { Module } from '@nestjs/common';
import { ProfessorGuard } from 'src/auth/guards/professor.guard';
import { CLASSROOM_SERVICE_TOKEN } from 'src/Classroom/abstract-services/abstract-classrom.service';
import { ClassroomController } from 'src/Classroom/classroom.controller';
import { ClassroomService } from 'src/Classroom/classroom.service';
import { CLASSROOM_REPOSITORY_TOKEN } from 'src/repositories/abstract/classroom.repository';
import { PrismaClassroomRepository } from 'src/repositories/prisma/prisma-classroom.repository';
import { StatsModule } from 'src/Stats/stats.module';

@Module({
  imports: [StatsModule],
  controllers: [ClassroomController],
  providers: [
    {
      provide: CLASSROOM_SERVICE_TOKEN,
      useClass: ClassroomService,
    },
    {
      provide: CLASSROOM_REPOSITORY_TOKEN,
      useClass: PrismaClassroomRepository,
    },
    ProfessorGuard,
  ],
  exports: [CLASSROOM_SERVICE_TOKEN],
})
export class ClassroomModule {}
