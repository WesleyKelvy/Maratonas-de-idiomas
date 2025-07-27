import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AiFeedbacks } from '@prisma/client';
import { StudentGuard } from '../auth/guards/student.guard';
import {
  AbstractAiFeedbackService,
  AI_FEEDBACK_SERVICE_TOKEN,
} from './abstract-services/abstract-aiFeedback.service';

@UseGuards(StudentGuard)
@Controller('submission/:submissionId/ai-feedback')
export class AiFeedbackController {
  constructor(
    @Inject(AI_FEEDBACK_SERVICE_TOKEN)
    private readonly aiFeedbackService: AbstractAiFeedbackService,
    // @Inject(SUBMISSION_SERVICE_TOKEN)
    // private readonly submissionService: AbstractSubmissionService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAllBySubmissionId(
    @Param('submissionId') submissionId: string,
    // @CurrentUser() user: UserFromJwt,
  ): Promise<AiFeedbacks[]> {
    // // Security Check: Verify if the submission belongs to the current user.
    // const submission = await this.submissionService.findOne(submissionId);

    // if (submission.user_id !== user.id) {
    //   throw new ForbiddenException(
    //     'You do not have permission to view feedback for this submission.',
    //   );
    // }

    return this.aiFeedbackService.findAllBySubmissionId(submissionId);
  }

  // @Get(':aiFeedbackId')
  // @HttpCode(HttpStatus.OK)
  // async findOne(
  //   @Param('submissionId', ParseUUIDPipe) submissionId: string,
  //   @Param('aiFeedbackId', ParseIntPipe) aiFeedbackId: number, // AiFeedbacks.id is Int in Prisma
  //   @CurrentUser() user: UserFromJwt,
  // ): Promise<AiFeedbacks> {
  //   // Security Check: First, verify if the submission belongs to the current user.
  //   const submission = await this.submissionService.findOne(submissionId);

  //   if (submission.user_id !== user.id) {
  //     throw new ForbiddenException(
  //       'You do not have permission to view feedback for this submission.',
  //     );
  //   }

  //   // Now, retrieve the specific AI feedback.
  //   // The service's findOne expects a string ID, so convert the number.
  //   const feedback = await this.aiFeedbackService.findOne(
  //     aiFeedbackId.toString(),
  //   );

  //   // Additional check: Ensure the retrieved feedback actually belongs to the specified submission.
  //   if (!feedback || feedback.submissionId !== submissionId) {
  //     throw new ForbiddenException(
  //       'Feedback not found for this submission or you do not have access.',
  //     );
  //   }

  //   return feedback;
  // }

  // The `saveFeedback` and `generateFeedback` methods from AiFeedbackService
  // are typically internal operations triggered by the SubmissionService
  // after a new submission is created and processed by the AI.
  // They are generally not exposed directly via public API endpoints.
  // If there were a specific administrative or internal tool that needed
  // to manually trigger feedback generation or saving, separate,
  // highly-protected endpoints would be created for those.
}
