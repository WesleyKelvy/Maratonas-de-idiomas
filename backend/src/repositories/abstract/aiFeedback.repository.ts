import { AiFeedbacks } from '@prisma/client';
import { SaveAiFeedbackDto } from 'src/AiFeedback/dto/aiFeedback.save.dto';

export abstract class AbstractAiFeedbackRepository {
  abstract saveFeedbacks(
    dto: SaveAiFeedbackDto[],
    submissionId: string,
  ): Promise<void>;
  abstract findOne(id: number): Promise<AiFeedbacks | null>;
  abstract findAllBySubmissionId(submissionId: string): Promise<AiFeedbacks[]>;
}

export const AI_FEEDBACK_REPOSITORY_TOKEN = 'AI_FEEDBACK_REPOSITORY_TOKEN';
