import { AiFeedbacks } from '@prisma/client';
import { AiFeedback } from 'src/AiFeedback/types/aiFeedback.type';

export abstract class AbstractAiFeedbackRepository {
  abstract saveFeedbacks(
    feedback: AiFeedback[],
    submissionId: string,
    marathonId: string,
  ): Promise<void>;
  abstract findOne(id: number): Promise<AiFeedbacks | null>;
  abstract findAllBySubmissionId(submissionId: string): Promise<AiFeedbacks[]>;
  abstract findAllByMarathonId(id: string): Promise<AiFeedbacks[]>;
}

export const AI_FEEDBACK_REPOSITORY_TOKEN = 'AI_FEEDBACK_REPOSITORY_TOKEN';
