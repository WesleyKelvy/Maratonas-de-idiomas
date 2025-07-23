import { Module } from '@nestjs/common';
import { ProfessorGuard } from 'src/auth/guards/professor.guard';
import { CLASSROOM_SERVICE_TOKEN } from 'src/classroom/abstract-services/abstract-classrom.service';
import { ClassroomController } from 'src/classroom/classroom.controller';
import { ClassroomService } from 'src/classroom/classroom.service';
import { CLASSROOM_REPOSITORY_TOKEN } from 'src/repositories/abstract/classroom.repository';
import { PrismaClassroomRepository } from 'src/repositories/prisma/prisma-classroom.repository';

@Module({
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
  exports: [],
})
export class ClassroomModule {}
