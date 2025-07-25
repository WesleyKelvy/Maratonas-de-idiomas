import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Question } from '@prisma/client';
import { UpdateLanguageMarathonDto } from 'src/LanguageMarathon/dto/language-marathon.update.dto';
import { AbstractQuestionService } from 'src/Question/abstract-services/abstract-question.service';
import { CreateQuestionDto } from 'src/Question/dto/question.create.dto';
import {
  AbstractQuestionRepository,
  QUESTION_REPOSITORY_TOKEN,
} from 'src/repositories/abstract/question.repository';

@Injectable()
export class QuestionService implements AbstractQuestionService {
  constructor(
    @Inject(QUESTION_REPOSITORY_TOKEN)
    private readonly questionRepository: AbstractQuestionRepository,
  ) {}

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
    return await this.questionRepository.create(marathonId, dto);
  }

  async findOne(id: string): Promise<Question> {
    const marathon = await this.questionRepository.findOne(id);
    if (!marathon) {
      throw new NotFoundException(`Marathon with ID ${id} not found.`);
    }

    return marathon;
  }

  async update(id: string, dto: UpdateLanguageMarathonDto): Promise<Question> {
    const marathon = await this.questionRepository.findOne(id);
    if (!marathon) {
      throw new NotFoundException(`Question with ID ${id} not found.`);
    }

    return await this.questionRepository.update(marathon.id, dto);
  }

  async remove(id: string): Promise<void> {
    const question = await this.questionRepository.findOne(id);
    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found.`);
    }
    await this.questionRepository.remove(id);
  }
}
