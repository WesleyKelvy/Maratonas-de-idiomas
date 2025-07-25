import { GoogleGenAI } from '@google/genai';
import { Module } from '@nestjs/common';
import { ProfessorGuard } from 'src/auth/guards/professor.guard';
import { QUESTION_SERVICE_TOKEN } from 'src/Question/abstract-services/abstract-question.service';
import { QuestionController } from 'src/Question/question.controller';
import { QuestionService } from 'src/Question/question.service';
import { QUESTION_REPOSITORY_TOKEN } from 'src/repositories/abstract/question.repository';
import { PrismaQuestionRepository } from 'src/repositories/prisma/prisma-question.repository';

@Module({
  controllers: [QuestionController],
  providers: [
    {
      provide: QUESTION_SERVICE_TOKEN,
      useClass: QuestionService,
    },
    {
      provide: QUESTION_REPOSITORY_TOKEN,
      useClass: PrismaQuestionRepository,
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
  exports: [QUESTION_SERVICE_TOKEN],
})
export class QuestionModule {}
