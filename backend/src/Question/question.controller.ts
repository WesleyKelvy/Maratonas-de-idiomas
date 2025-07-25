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
  AbstractQuestionService,
  QUESTION_SERVICE_TOKEN,
} from 'src/Question/abstract-services/abstract-question.service';
import { CreateQuestionDto } from 'src/Question/dto/question.create.dto';
import { UpdateQuestionDto } from 'src/Question/dto/question.update.dto';

@UseGuards(ProfessorGuard)
@Controller('/classrooms/:code/:marathonId/question')
export class QuestionController {
  constructor(
    @Inject(QUESTION_SERVICE_TOKEN)
    private readonly questionService: AbstractQuestionService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateQuestionDto,
    @Param('marathonId') id: string,
  ): Promise<Question> {
    return this.questionService.create(dto, id);
  }

  @Get()
  findAllByMarathonId(@Param('marathonId') id: string): Promise<Question[]> {
    return this.questionService.findAllByMarathonId(id);
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
