import { Question } from '@prisma/client';
import { UpdateQuestionDto } from 'src/Question/dto/question.update.dto';
import { QuestionArray } from 'src/Question/interfaces/geminiResponse';
import { GenerateQuestionsDto } from 'src/Question/interfaces/GenerateQuestions';

export abstract class AbstractQuestionService {
  abstract create(dto: QuestionArray, marathonId: string): Promise<Question[]>;
  abstract findOne(id: number): Promise<Question>;
  abstract findAllByMarathonId(id: string): Promise<Question[]>;
  abstract update(id: number, dto: UpdateQuestionDto): Promise<Question>;
  abstract remove(id: number): Promise<void>;
  abstract generateQuestionsWithGemini({
    context,
    difficulty,
    number_of_questions,
  }: GenerateQuestionsDto): Promise<QuestionArray>;
}

export const QUESTION_SERVICE_TOKEN = 'QUESTION_SERVICE_TOKEN';
