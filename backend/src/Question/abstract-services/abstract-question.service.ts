import { Question } from '@prisma/client';
import { CreateQuestionDto } from 'src/Question/dto/question.create.dto';
import { UpdateQuestionDto } from 'src/Question/dto/question.update.dto';
import { GenerateQuestionsDto } from 'src/Question/interfaces/generateQuestionsDto';

export abstract class AbstractQuestionService {
  abstract create(
    dto: CreateQuestionDto,
    marathonId: string,
  ): Promise<Question>;
  abstract findOne(id: number): Promise<Question>;
  abstract findAllByMarathonId(id: string): Promise<Question[]>;
  abstract update(id: number, dto: UpdateQuestionDto): Promise<Question>;
  abstract remove(id: number): Promise<void>;
  abstract generateQuestionsWithGemini(
    dto: GenerateQuestionsDto,
    marathonId: string,
  ): Promise<Question[]>;
}

export const QUESTION_SERVICE_TOKEN = 'QUESTION_SERVICE_TOKEN';
