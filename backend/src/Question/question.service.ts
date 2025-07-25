import { GoogleGenAI } from '@google/genai';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Question } from '@prisma/client';
import { UpdateLanguageMarathonDto } from 'src/LanguageMarathon/dto/language-marathon.update.dto';
import { AbstractQuestionService } from 'src/Question/abstract-services/abstract-question.service';
import { CreateQuestionDto } from 'src/Question/dto/question.create.dto';
import { GeminiResponse } from 'src/Question/interfaces/geminiResponse';
import { GenerateQuestionsDto } from 'src/Question/interfaces/generateQuestionsDto';
import { createQuestionPromptTemplate } from 'src/Question/prompts/create-questions';
import {
  AbstractQuestionRepository,
  QUESTION_REPOSITORY_TOKEN,
} from 'src/repositories/abstract/question.repository';

@Injectable()
export class QuestionService implements AbstractQuestionService {
  constructor(
    @Inject(QUESTION_REPOSITORY_TOKEN)
    private readonly questionRepository: AbstractQuestionRepository,
    private readonly gemini: GoogleGenAI,
  ) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not found.');
    }
    this.gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  async generateQuestionsWithGemini(
    dto: GenerateQuestionsDto,
    marathonId: string,
  ): Promise<Question[]> {
    const promptTemplate = createQuestionPromptTemplate(dto);

    try {
      const output = await this.gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptTemplate,
      });

      console.log(output.text);

      const response = output.text;

      // Clean the response to ensure it is valid JSON.
      // Gemini might sometimes include ```json ... ``` markers.
      const cleanedText = response
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      console.log('cleanedText: ', cleanedText);
      // parse into the wrapper
      const genResp: GeminiResponse = JSON.parse(cleanedText);

      console.log('genResp: ', genResp);

      const creations = genResp.questions.map((q) =>
        this.create(
          {
            prompt_text: q.question_text,
          },
          marathonId,
        ),
      );

      const createdQuestions: Question[] = await Promise.all(creations);

      return createdQuestions;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAllByMarathonId(id: string): Promise<Question[]> {
    const question = await this.questionRepository.findAllByMarathonId(id);
    if (!question) {
      throw new NotFoundException(
        `Marathons for this classroom does not exist.`,
      );
    }

    return question;
  }

  async create(dto: CreateQuestionDto, marathonId: string): Promise<Question> {
    return await this.questionRepository.create(dto, marathonId);
  }

  async findOne(id: number): Promise<Question> {
    const marathon = await this.questionRepository.findOne(id);
    if (!marathon) {
      throw new NotFoundException(`Question with ID ${id} not found.`);
    }

    return marathon;
  }

  async update(id: number, dto: UpdateLanguageMarathonDto): Promise<Question> {
    const marathon = await this.questionRepository.findOne(id);
    if (!marathon) {
      throw new NotFoundException(`Question with ID ${id} not found.`);
    }

    return await this.questionRepository.update(marathon.id, dto);
  }

  async remove(id: number): Promise<void> {
    const question = await this.questionRepository.findOne(id);
    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found.`);
    }
    await this.questionRepository.remove(id);
  }
}
