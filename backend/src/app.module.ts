import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AiFeedbackModule } from 'src/AiFeedback/aiFeedback.module';
import { ClassroomModule } from 'src/Classroom/classroom.module';
import { EnrollmentModule } from 'src/Enrollment/enrollment.module';
import { LanguageMarathonModule } from 'src/LanguageMarathon/language-marathon.module';
import { LeaderboardModule } from 'src/Leaderboard/leaderboard.module';
import { MarathonProgressModule } from 'src/Marathon-Progress/marathon-progress.module';
import { QuestionModule } from 'src/Question/question.module';
import { ReportModule } from 'src/Report/report.module';
import { SubmissionModule } from 'src/Submission/submission.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { MailerModule } from './Mailer/mailer.module';
import { PrismaModule } from './prisma/prisma.module';
import { StatsModule } from './Stats/stats.module';
import { UserModule } from './User/user.module';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    AuthModule,
    PrismaModule,
    UserModule,
    MailerModule,
    StatsModule,
    ClassroomModule,
    LanguageMarathonModule,
    EnrollmentModule,
    QuestionModule,
    SubmissionModule,
    AiFeedbackModule,
    LeaderboardModule,
    ReportModule,
    MarathonProgressModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
