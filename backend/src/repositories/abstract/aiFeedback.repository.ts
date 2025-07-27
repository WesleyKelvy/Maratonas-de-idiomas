import { Submission } from '@prisma/client';
import { SaveAiFeedbackDto } from 'src/AiFeedback/dto/aiFeedback.save.dto';
import { AiFeedBack } from 'src/AiFeedback/entities/aiFeedback.entity';

export abstract class AbstractAiFeedbackRepository {
  abstract saveFeedbacks(
    dto: SaveAiFeedbackDto[],
    submissionId: string,
  ): Promise<void>;
  abstract findOne(id: string): Promise<Submission | null>;
  abstract findAllBySubmissionId(userId: string): Promise<AiFeedBack[]>;
}

export const AI_FEEDBACK_REPOSITORY_TOKEN = 'AI_FEEDBACK_REPOSITORY_TOKEN';
