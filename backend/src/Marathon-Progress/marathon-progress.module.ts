import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { StudentGuard } from 'src/auth/guards/student.guard';
import { EnrollmentModule } from 'src/Enrollment/enrollment.module';
import { LanguageMarathonController } from 'src/LanguageMarathon/language-marathon.controller';
import { LanguageMarathonModule } from 'src/LanguageMarathon/language-marathon.module';
import { MARATHON_PROGRESS_SERVICE_TOKEN } from 'src/Marathon-Progress/abstract-services/abstract-marathon-progess.service';
import { MarathonSessionGateway } from 'src/Marathon-Progress/gateway/marathon-session.gateway';
import { MarathonProgressService } from 'src/Marathon-Progress/marathon-progress.service';
import { MARATHON_PROGRESS_REPOSITORY_TOKEN } from 'src/repositories/abstract/marathon-progress.repository';
import { PrismaMarathonProgressRepository } from 'src/repositories/prisma/prisma-marathon-progress.repository';

@Module({
  imports: [LanguageMarathonModule, EnrollmentModule, AuthModule],
  controllers: [LanguageMarathonController],
  providers: [
    MarathonSessionGateway,
    {
      provide: MARATHON_PROGRESS_SERVICE_TOKEN,
      useClass: MarathonProgressService,
    },
    {
      provide: MARATHON_PROGRESS_REPOSITORY_TOKEN,
      useClass: PrismaMarathonProgressRepository,
    },
    StudentGuard,
  ],
  exports: [MARATHON_PROGRESS_SERVICE_TOKEN, MarathonSessionGateway],
})
export class MarathonProgressModule {}
