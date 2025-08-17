import { Submission } from '@prisma/client';
import { CreateSubmissionDto } from 'src/Submission/dto/submission.create.dto';
import { UpdateSubmissionDto } from 'src/Submission/dto/submission.update.dto';

export abstract class AbstractSubmissionRepository {
  abstract create(
    dto: CreateSubmissionDto,
    questionId: number,
    userId: string,
  ): Promise<Submission>;
  abstract findOne(id: string): Promise<Submission | null>;
  abstract findAllByUserId(userId: string): Promise<Submission[]>;
  abstract update(
    dto: UpdateSubmissionDto,
    submissionId: string,
  ): Promise<void>;
}

export const SUBMISSION_REPOSITORY_TOKEN = 'SUBMISSION_REPOSITORY_TOKEN';
