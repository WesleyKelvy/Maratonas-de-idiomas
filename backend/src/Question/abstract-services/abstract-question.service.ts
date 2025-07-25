import { Question } from '@prisma/client';
import { UpdateLanguageMarathonDto } from 'src/LanguageMarathon/dto/language-marathon.update.dto';
import { CreateQuestionDto } from 'src/Question/dto/question.create.dto';

export abstract class AbstractQuestionService {
  abstract create(
    dto: CreateQuestionDto,
    marathonId: string,
  ): Promise<Question>;
  abstract findOne(id: string): Promise<Question>;
  abstract findAllByMarathonId(id: string): Promise<Question[]>;
  abstract update(
    id: string,
    dto: UpdateLanguageMarathonDto,
  ): Promise<Question>;
  abstract remove(id: string): Promise<void>;
}

export const QUESTION_SERVICE_TOKEN = 'QUESTION_SERVICE_TOKEN';
