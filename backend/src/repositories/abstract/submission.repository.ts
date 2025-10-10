import { Submission } from '@prisma/client';
import { UpdateSubmissionDto } from 'src/Submission/dto/submission.update.dto';

export abstract class AbstractSubmissionRepository {
  abstract create(
    answer: string,
    questionId: number,
    userId: string,
    marathonId: string,
  ): Promise<Submission>;
  abstract findOne(id: string): Promise<Submission | null>;
  abstract findAllByUserId(userId: string): Promise<Submission[]>;
  abstract findAllByMarathonId(marathonId: string): Promise<Submission[]>;
  abstract update(
    dto: UpdateSubmissionDto,
    submissionId: string,
  ): Promise<void>;
}

export const SUBMISSION_REPOSITORY_TOKEN = 'SUBMISSION_REPOSITORY_TOKEN';
