import { AiFeedbacks } from '@prisma/client';
import { GenerateAiFeedbackDto } from 'src/AiFeedback/dto/aiFeedback.generate.dto';
import { SaveAiFeedbackDto } from 'src/AiFeedback/dto/aiFeedback.save.dto';
import { CorrectionReport } from 'src/AiFeedback/interfaces/correctionResponse';

export abstract class AbstractAiFeedbackService {
  abstract saveFeedback(
    dto: SaveAiFeedbackDto[],
    questionId: string,
  ): Promise<void>;
  abstract findAllBySubmissionId(id: string): Promise<AiFeedbacks[]>;
  abstract generateFeedback(
    dto: GenerateAiFeedbackDto,
  ): Promise<CorrectionReport>;
}

export const AI_FEEDBACK_SERVICE_TOKEN = 'AI_FEEDBACK_SERVICE_TOKEN';
