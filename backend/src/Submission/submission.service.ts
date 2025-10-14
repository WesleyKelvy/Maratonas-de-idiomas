import { InjectQueue } from '@nestjs/bull';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Submission } from '@prisma/client';
import { Queue } from 'bull';
import {
  AbstractLanguageMarathonService,
  LANGUAGE_MARATHON_SERVICE_TOKEN,
} from 'src/LanguageMarathon/abstract-services/abstract-language-marathon.service';
import {
  AbstractSubmissionRepository,
  SUBMISSION_REPOSITORY_TOKEN,
} from 'src/repositories/abstract/submission.repository';
import { AbstractSubmissionService } from 'src/Submission/abstract-services/abstract-submission.service';
import { UpdateSubmissionDto } from 'src/Submission/dto/submission.update.dto';
import { SubmissionWithMarathonAndQuestionTitle } from 'src/Submission/entities/submission.entity';

@Injectable()
export class SubmissionService implements AbstractSubmissionService {
  constructor(
    @Inject(SUBMISSION_REPOSITORY_TOKEN)
    private readonly submissionRepository: AbstractSubmissionRepository,
    @Inject(LANGUAGE_MARATHON_SERVICE_TOKEN)
    private readonly marathonService: AbstractLanguageMarathonService,
    @InjectQueue('feedback') private readonly feedbackQueue: Queue,
  ) {}

  async create(
    answer: string,
    questionId: number,
    userId: string,
    marathonId: string,
  ): Promise<void> {
    const { end_date } = await this.marathonService.findOneById(marathonId);

    if (end_date < new Date()) throw new BadRequestException();

    const { id } = await this.submissionRepository.create(
      answer,
      questionId,
      userId,
      marathonId,
    );

    await this.feedbackQueue.add(
      'generate-feedback',
      {
        submissionId: id,
        questionId: questionId,
        studentAnswer: answer,
      },
      {
        // Optional: remove job from redis after it's completed
        removeOnComplete: true,
        // Optional: unique job ID to prevent duplicates if the marathon is updated multiple times
        jobId: `question-${id}`,
      },
    );
  }

  async update(dto: UpdateSubmissionDto, submissionId: string): Promise<void> {
    await this.submissionRepository.update(dto, submissionId);
  }

  async findAllByUserId(
    id: string,
  ): Promise<SubmissionWithMarathonAndQuestionTitle[]> {
    const submissions = await this.submissionRepository.findAllByUserId(id);
    if (!submissions) {
      throw new NotFoundException(`Submissions for this user does not exist.`);
    }

    return submissions;
  }

  async findAllByMarathonId(marathonId: string): Promise<Submission[]> {
    const submissions =
      await this.submissionRepository.findAllByMarathonId(marathonId);
    if (!submissions) {
      throw new NotFoundException(
        `Submissions for this marathon does not exist.`,
      );
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
