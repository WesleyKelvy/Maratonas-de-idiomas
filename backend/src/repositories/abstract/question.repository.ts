import { Question } from '@prisma/client';
import { CreateQuestionDto } from 'src/Question/dto/question.create.dto';
import { UpdateQuestionDto } from 'src/Question/dto/question.update.dto';

export abstract class AbstractQuestionRepository {
  abstract create(
    marathonId: string,
    dto: CreateQuestionDto,
  ): Promise<Question>;
  abstract findOne(userId: string): Promise<Question | null>;
  abstract findAllByMarathonId(userId: string): Promise<Question[]>;
  abstract update(
    marathonId: string,
    dto: UpdateQuestionDto,
  ): Promise<Question>;
  abstract remove(code: string): Promise<void>;
}

export const QUESTION_REPOSITORY_TOKEN = 'QUESTION_REPOSITORY_TOKEN';
