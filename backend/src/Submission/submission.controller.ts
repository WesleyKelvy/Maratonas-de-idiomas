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
import { Role, Submission } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import {
  AbstractSubmissionService,
  SUBMISSION_SERVICE_TOKEN,
} from 'src/Submission/abstract-services/abstract-submission.service';
import { CreateSubmissionDto } from 'src/Submission/dto/submission.create.dto';
import { SubmissionWithMarathonAndQuestionTitle } from 'src/Submission/entities/submission.entity';

@Controller('submission')
export class SubmissionController {
  constructor(
    @Inject(SUBMISSION_SERVICE_TOKEN)
    private readonly submissionService: AbstractSubmissionService,
  ) {}

  @UseGuards(RolesGuard)
  @Roles(Role.Student)
  @Post('marathon/:marathonId/question/:questionId')
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() { answer }: CreateSubmissionDto,
    @Param('questionId') questionId: string,
    @Param('marathonId') marathonId: string,
    @CurrentUser()
    user: UserFromJwt,
  ): Promise<void> {
    return this.submissionService.create(
      answer,
      parseInt(questionId),
      user.id,
      marathonId,
    );
  }

  @Get('user/get-my-submissions')
  findAllByUserId(
    @CurrentUser() user: UserFromJwt,
  ): Promise<SubmissionWithMarathonAndQuestionTitle[]> {
    return this.submissionService.findAllByUserId(user.id);
  }

  @Get('marathon/:marathonId')
  findAllByMarathonId(
    @Param('marathonId') marathonId: string,
  ): Promise<Submission[]> {
    return this.submissionService.findAllByMarathonId(marathonId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Submission> {
    return this.submissionService.findOne(id);
  }
}
