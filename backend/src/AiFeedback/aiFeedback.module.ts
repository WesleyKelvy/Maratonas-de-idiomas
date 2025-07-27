import { GoogleGenAI } from '@google/genai';
import { Module } from '@nestjs/common';
import { AiFeedbackService } from 'src/AiFeedback/aiFeedback.service';
import { ProfessorGuard } from 'src/auth/guards/professor.guard';
import { AI_FEEDBACK_REPOSITORY_TOKEN } from 'src/repositories/abstract/aiFeedback.repository';
import { AI_CORRECTION_SERVICE_TOKEN } from 'src/Submission/abstract-services/abstract-aiFeedback.service';

@Module({
  imports: [],
  providers: [
    {
      provide: AI_CORRECTION_SERVICE_TOKEN,
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
  exports: [AI_CORRECTION_SERVICE_TOKEN],
})
export class AiFeedBackModule {}
