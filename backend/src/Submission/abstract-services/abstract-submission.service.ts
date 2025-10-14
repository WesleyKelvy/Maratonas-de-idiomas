import { Submission } from '@prisma/client';
import { UpdateSubmissionDto } from 'src/Submission/dto/submission.update.dto';
import { SubmissionWithMarathonAndQuestionTitle } from 'src/Submission/entities/submission.entity';

export abstract class AbstractSubmissionService {
  abstract create(
    answer: string,
    questionId: number,
    userId: string,
    marathonId: string,
  ): Promise<void>;
  abstract findAllByUserId(
    userId: string,
  ): Promise<SubmissionWithMarathonAndQuestionTitle[]>;
  abstract findOne(submissionId: string): Promise<Submission>;
  abstract update(
    dto: UpdateSubmissionDto,
    submissionId: string,
  ): Promise<void>;
  abstract findAllByMarathonId(marathonI: string): Promise<Submission[]>;
}

export const SUBMISSION_SERVICE_TOKEN = 'SUBMISSION_SERVICE_TOKEN';
