import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Submission } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { StudentGuard } from 'src/auth/guards/student.guard';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import {
  AbstractSubmissionService,
  SUBMISSION_SERVICE_TOKEN,
} from 'src/Submission/abstract-services/abstract-submission.service';
import { CreateSubmissionDto } from 'src/Submission/dto/submission.create.dto';

@UseGuards(StudentGuard)
@Controller('question/:questionId/submission')
export class SubmissionController {
  constructor(
    @Inject(SUBMISSION_SERVICE_TOKEN)
    private readonly submissionService: AbstractSubmissionService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateSubmissionDto,
    @Param('questionId') questionId: string,
    @CurrentUser()
    user: UserFromJwt,
  ): Promise<void> {
    return this.submissionService.create(dto, questionId, user.id);
  }

  @Get()
  findAllByUserId(@CurrentUser() user: UserFromJwt): Promise<Submission[]> {
    return this.submissionService.findAllByUserId(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Submission> {
    return this.submissionService.findOne(id);
  }
}
