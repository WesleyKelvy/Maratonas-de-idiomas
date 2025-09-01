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

@UseGuards(RolesGuard)
@Roles(Role.Student)
@Controller('marathon/:marathonId/question/:questionId/submission')
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
    @Param('marathonId') marathonId: string,
    @CurrentUser()
    user: UserFromJwt,
  ): Promise<void> {
    return this.submissionService.create(
      dto,
      parseInt(questionId),
      user.id,
      marathonId,
    );
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
