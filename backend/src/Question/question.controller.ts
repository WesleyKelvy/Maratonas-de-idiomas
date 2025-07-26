import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Question } from '@prisma/client';
import { ProfessorGuard } from 'src/auth/guards/professor.guard';
import {
  AbstractLanguageMarathonService,
  LANGUAGE_MARATHON_SERVICE_TOKEN,
} from 'src/LanguageMarathon/abstract-services/abstract-language-marathon.service';
import {
  AbstractQuestionService,
  QUESTION_SERVICE_TOKEN,
} from 'src/Question/abstract-services/abstract-question.service';
import { UpdateQuestionDto } from 'src/Question/dto/question.update.dto';
import {
  QuestionArray,
  QuestionArrayDto,
} from 'src/Question/interfaces/geminiResponse';
import { GenerateQuestionsDto } from 'src/Question/interfaces/generateQuestionsDto';

@UseGuards(ProfessorGuard)
@Controller('/classrooms/:code/marathon/:marathonId')
export class QuestionController {
  constructor(
    @Inject(QUESTION_SERVICE_TOKEN)
    private readonly questionService: AbstractQuestionService,
    @Inject(LANGUAGE_MARATHON_SERVICE_TOKEN)
    private readonly marathonService: AbstractLanguageMarathonService,
  ) {}

  @Post('/get-questions')
  @HttpCode(HttpStatus.CREATED)
  async getGeminiQuestions(
    @Param('marathonId') marathonId: string,
  ): Promise<QuestionArray> {
    const data = await this.marathonService.findOne(marathonId);
    return this.questionService.generateQuestionsWithGemini(data);
  }

  @Post('save-questions')
  @HttpCode(HttpStatus.CREATED)
  async sabeQuestions(
    @Param('marathonId') marathonId: string,
    @Body() dto: QuestionArrayDto,
  ): Promise<Question[]> {
    return this.questionService.create(dto.questions, marathonId);
  }

  @Post() // Gemini
  @HttpCode(HttpStatus.CREATED)
  generateQuestions(@Body() dto: GenerateQuestionsDto): Promise<QuestionArray> {
    return this.questionService.generateQuestionsWithGemini(dto);
  }

  @Get('questions')
  findAllByMarathonId(
    @Param('marathonId') marathonId: string,
  ): Promise<Question[]> {
    return this.questionService.findAllByMarathonId(marathonId);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Question> {
    return this.questionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateDto: UpdateQuestionDto,
  ): Promise<Question> {
    return this.questionService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number): Promise<void> {
    return this.questionService.remove(id);
  }
}
