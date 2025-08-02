import { Module } from '@nestjs/common';
import { ProfessorGuard } from 'src/auth/guards/professor.guard';
import { ClassroomModule } from 'src/Classroom/classroom.module';
import { ENROLLEMENT_SERVICE_TOKEN } from 'src/Enrollment/abstract-services/abstract-enrollment.service';
import { EnrollmentController } from 'src/Enrollment/enrollment.controller';
import { EnrollmentService } from 'src/Enrollment/enrollment.service';
import { ENROLLEMNT_REPOSITORY_TOKEN } from 'src/repositories/abstract/enrollment.repository';
import { PrismaEnrollmentRepository } from 'src/repositories/prisma/prisma-enrollment.repository';
import { StatsModule } from 'src/Stats/stats.module';

@Module({
  imports: [ClassroomModule, StatsModule],
  controllers: [EnrollmentController],
  providers: [
    {
      provide: ENROLLEMENT_SERVICE_TOKEN,
      useClass: EnrollmentService,
    },
    {
      provide: ENROLLEMNT_REPOSITORY_TOKEN,
      useClass: PrismaEnrollmentRepository,
    },
    ProfessorGuard,
  ],
  exports: [ENROLLEMENT_SERVICE_TOKEN],
})
export class EnrollmentModule {}
