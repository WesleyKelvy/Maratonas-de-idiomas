import { Module } from '@nestjs/common';
import { AiFeedbackModule } from 'src/AiFeedback/aiFeedback.module';
import { ProfessorGuard } from 'src/auth/guards/professor.guard';
import { QuestionModule } from 'src/Question/question.module';
import { SUBMISSION_REPOSITORY_TOKEN } from 'src/repositories/abstract/submission.repository';
import { PrismaSubmissionRepository } from 'src/repositories/prisma/prisma-submission.repository';
import { SUBMISSION_SERVICE_TOKEN } from 'src/Submission/abstract-services/abstract-submission.service';
import { SubmissionController } from 'src/Submission/submission.controller';
import { SubmissionService } from 'src/Submission/submission.service';

@Module({
  imports: [QuestionModule, AiFeedbackModule],
  controllers: [SubmissionController],
  providers: [
    {
      provide: SUBMISSION_SERVICE_TOKEN,
      useClass: SubmissionService,
    },
    {
      provide: SUBMISSION_REPOSITORY_TOKEN,
      useClass: PrismaSubmissionRepository,
    },
    ProfessorGuard,
  ],
  exports: [SUBMISSION_SERVICE_TOKEN],
})
export class SubmissionModule {}
