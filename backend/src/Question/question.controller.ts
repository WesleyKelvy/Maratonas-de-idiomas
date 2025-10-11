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
import { Question, Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
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

@Controller('questions')
export class QuestionController {
  constructor(
    @Inject(QUESTION_SERVICE_TOKEN)
    private readonly questionService: AbstractQuestionService,
    @Inject(LANGUAGE_MARATHON_SERVICE_TOKEN)
    private readonly marathonService: AbstractLanguageMarathonService,
  ) {}

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Question> {
    return this.questionService.findOne(id);
  }

  @Get('marathon/:marathonId')
  findAllByMarathonId(
    @Param('marathonId') marathonId: string,
  ): Promise<Question[]> {
    return this.questionService.findAllByMarathonId(marathonId);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Professor)
  @Post('create-questions')
  @HttpCode(HttpStatus.CREATED)
  async getGeminiQuestions(
    @Param('marathonId') marathonId: string,
  ): Promise<QuestionArray> {
    const { context, difficulty, number_of_questions } =
      await this.marathonService.findOneById(marathonId);
    return this.questionService.generateQuestionsWithGemini({
      context,
      difficulty,
      number_of_questions,
    });
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Professor)
  @Post('save-questions')
  @HttpCode(HttpStatus.CREATED)
  async saveQuestions(
    @Param('marathonId') marathonId: string,
    @Body() dto: QuestionArrayDto,
  ): Promise<Question[]> {
    return this.questionService.create(dto.questions, marathonId);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Professor)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateDto: UpdateQuestionDto,
  ): Promise<Question> {
    return this.questionService.update(id, updateDto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Professor)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number): Promise<void> {
    return this.questionService.remove(id);
  }
}
