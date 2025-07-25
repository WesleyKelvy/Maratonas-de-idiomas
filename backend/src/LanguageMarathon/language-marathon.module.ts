import { Module } from '@nestjs/common';
import { ProfessorGuard } from 'src/auth/guards/professor.guard';
import { LANGUAGE_MARATHON_SERVICE_TOKEN } from 'src/LanguageMarathon/abstract-services/abstract-language-marathon.service';
import { LanguageMarathonController } from 'src/LanguageMarathon/language-marathon.controller';
import { LanguageMarathonService } from 'src/LanguageMarathon/language-marathon.service';
import { QuestionModule } from 'src/Question/question.module';
import { LANGUAGE_MARATHON_REPOSITORY_TOKEN } from 'src/repositories/abstract/languageMarathon.repository';
import { PrismaLanguageMarathonRepository } from 'src/repositories/prisma/prisma-language-marathon.repository';

@Module({
  imports: [QuestionModule],
  controllers: [LanguageMarathonController],
  providers: [
    {
      provide: LANGUAGE_MARATHON_SERVICE_TOKEN,
      useClass: LanguageMarathonService,
    },
    {
      provide: LANGUAGE_MARATHON_REPOSITORY_TOKEN,
      useClass: PrismaLanguageMarathonRepository,
    },
    ProfessorGuard,
  ],
  exports: [LANGUAGE_MARATHON_SERVICE_TOKEN],
})
export class LanguageMarathonModule {}
