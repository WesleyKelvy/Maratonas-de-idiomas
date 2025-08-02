import { GoogleGenAI } from '@google/genai';
import { forwardRef, Module } from '@nestjs/common';
import { AI_FEEDBACK_SERVICE_TOKEN } from 'src/AiFeedback/abstract-services/abstract-aiFeedback.service';
import { AiFeedbackController } from 'src/AiFeedback/aiFeedback.controller';
import { AiFeedbackService } from 'src/AiFeedback/aiFeedback.service';
import { ProfessorGuard } from 'src/auth/guards/professor.guard';
import { AI_FEEDBACK_REPOSITORY_TOKEN } from 'src/repositories/abstract/aiFeedback.repository';
import { PrismaAiFeedbackRepository } from 'src/repositories/prisma/prisma-ai-feedback.repository';
import { ProfessorStats } from 'src/Stats/entities/professor.stats.entity';
import { StudentStats } from 'src/Stats/entities/student.stats.entity';
import { SubmissionModule } from 'src/Submission/submission.module';

@Module({
  imports: [forwardRef(() => SubmissionModule), StudentStats, ProfessorStats],
  controllers: [AiFeedbackController],
  providers: [
    {
      provide: AI_FEEDBACK_SERVICE_TOKEN,
      useClass: AiFeedbackService,
    },
    {
      provide: AI_FEEDBACK_REPOSITORY_TOKEN,
      useClass: PrismaAiFeedbackRepository,
    },
    ProfessorGuard,
    {
      provide: GoogleGenAI,
      useFactory: () => {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
          throw new Error('GEMINI_API_KEY not set');
        }
        return new GoogleGenAI({ apiKey });
      },
    },
  ],
  exports: [AI_FEEDBACK_SERVICE_TOKEN],
})
export class AiFeedbackModule {}
