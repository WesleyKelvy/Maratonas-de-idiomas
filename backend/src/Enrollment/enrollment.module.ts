import { Module } from '@nestjs/common';
import { ProfessorGuard } from 'src/auth/guards/professor.guard';
import { ClassroomModule } from 'src/Classroom/classroom.module';
import { ENROLLMENT_SERVICE_TOKEN } from 'src/Enrollment/abstract-services/abstract-enrollment.service';
import { EnrollmentController } from 'src/Enrollment/enrollment.controller';
import { EnrollmentService } from 'src/Enrollment/enrollment.service';
import { LanguageMarathonModule } from 'src/LanguageMarathon/language-marathon.module';
import { ENROLLMENT_REPOSITORY_TOKEN } from 'src/repositories/abstract/enrollment.repository';
import { PrismaEnrollmentRepository } from 'src/repositories/prisma/prisma-enrollment.repository';
import { StatsModule } from 'src/Stats/stats.module';
import { UserModule } from 'src/User/user.module';

@Module({
  imports: [ClassroomModule, StatsModule, LanguageMarathonModule, UserModule],
  controllers: [EnrollmentController],
  providers: [
    {
      provide: ENROLLMENT_SERVICE_TOKEN,
      useClass: EnrollmentService,
    },
    {
      provide: ENROLLMENT_REPOSITORY_TOKEN,
      useClass: PrismaEnrollmentRepository,
    },
    ProfessorGuard,
  ],
  exports: [ENROLLMENT_SERVICE_TOKEN],
})
export class EnrollmentModule {}
