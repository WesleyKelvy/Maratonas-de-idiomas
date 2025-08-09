import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Submission } from '@prisma/client';
import {
  AbstractAiFeedbackService,
  AI_FEEDBACK_SERVICE_TOKEN,
} from 'src/AiFeedback/abstract-services/abstract-aiFeedback.service';
import { GenerateAiFeedbackDto } from 'src/AiFeedback/dto/aiFeedback.generate.dto';
import { SaveAiFeedbackDto } from 'src/AiFeedback/dto/aiFeedback.save.dto';
import {
  AbstractQuestionService,
  QUESTION_SERVICE_TOKEN,
} from 'src/Question/abstract-services/abstract-question.service';
import {
  AbstractSubmissionRepository,
  SUBMISSION_REPOSITORY_TOKEN,
} from 'src/repositories/abstract/submission.repository';
import { AbstractSubmissionService } from 'src/Submission/abstract-services/abstract-submission.service';
import { CreateSubmissionDto } from 'src/Submission/dto/submission.create.dto';
import { UpdateSubmissionDto } from 'src/Submission/dto/submission.update.dto';

@Injectable()
export class SubmissionService implements AbstractSubmissionService {
  constructor(
    @Inject(SUBMISSION_REPOSITORY_TOKEN)
    private readonly submissionRepository: AbstractSubmissionRepository,
    @Inject(QUESTION_SERVICE_TOKEN)
    private readonly questionService: AbstractQuestionService,
    @Inject(AI_FEEDBACK_SERVICE_TOKEN)
    private readonly aiFeedbackService: AbstractAiFeedbackService,
  ) {}

  async create(
    dto: CreateSubmissionDto,
    questionId: string,
    userId: string,
  ): Promise<void> {
    const submission = await this.submissionRepository.create(
      dto,
      questionId,
      userId,
    );

    const { prompt_text, marathon_id } = await this.questionService.findOne(
      submission.question_id,
    );

    // make data for generate AI feedback
    const data: GenerateAiFeedbackDto = {
      question: prompt_text,
      studentAnswer: submission.answer,
    };

    // calls AI for generate the feedback
    const { corrected_answer, errors, final_score } =
      await this.aiFeedbackService.generateFeedback(data);

    const formattedErrors: SaveAiFeedbackDto[] = errors.map((error) => ({
      explanation: error.explanation,
      pointsDeducted: error.points_deducted,
    }));

    // save feedback errors for question answer
    await this.aiFeedbackService.saveFeedback(
      formattedErrors,
      submission.id,
      marathon_id,
    );

    // update submission with AI feedback
    await this.submissionRepository.update(
      { correctedAnswer: corrected_answer, score: final_score },
      submission.id,
    );
  }

  async update(dto: UpdateSubmissionDto, submissionId: string): Promise<void> {
    await this.submissionRepository.update(dto, submissionId);
  }

  async findAllByUserId(id: string): Promise<Submission[]> {
    const submissions = await this.submissionRepository.findAllByUserId(id);
    if (!submissions) {
      throw new NotFoundException(`Submissions for this user does not exist.`);
    }

    return submissions;
  }

  async findOne(id: string): Promise<Submission> {
    const submission = await this.submissionRepository.findOne(id);
    if (!submission) {
      throw new NotFoundException(`Submissions with ID ${id} not found.`);
    }

    return submission;
  }
}
