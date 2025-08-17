import { Submission } from '@prisma/client';
import { CreateSubmissionDto } from 'src/Submission/dto/submission.create.dto';
import { UpdateSubmissionDto } from 'src/Submission/dto/submission.update.dto';

export abstract class AbstractSubmissionService {
  abstract create(
    dto: CreateSubmissionDto,
    questionId: number,
    userId: string,
    marathonId: string,
  ): Promise<void>;
  abstract findAllByUserId(userId: string): Promise<Submission[]>;
  abstract findOne(submissionId: string): Promise<Submission>;
  abstract update(
    dto: UpdateSubmissionDto,
    submissionId: string,
  ): Promise<void>;
}

export const SUBMISSION_SERVICE_TOKEN = 'SUBMISSION_SERVICE_TOKEN';
