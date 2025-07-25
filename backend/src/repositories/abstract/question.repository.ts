import { Question } from '@prisma/client';
import { CreateQuestionDto } from 'src/Question/dto/question.create.dto';
import { UpdateQuestionDto } from 'src/Question/dto/question.update.dto';

export abstract class AbstractQuestionRepository {
  abstract create(
    dto: CreateQuestionDto,
    marathonId: string,
  ): Promise<Question>;
  abstract findOne(id: number): Promise<Question | null>;
  abstract findAllByMarathonId(marathonId: string): Promise<Question[]>;
  abstract update(id: number, dto: UpdateQuestionDto): Promise<Question>;
  abstract remove(id: number): Promise<void>;
}

export const QUESTION_REPOSITORY_TOKEN = 'QUESTION_REPOSITORY_TOKEN';
