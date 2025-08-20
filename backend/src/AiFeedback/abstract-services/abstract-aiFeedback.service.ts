import { AiFeedbacks } from '@prisma/client';

import { CorrectionReport } from 'src/AiFeedback/interfaces/correctionResponse';
import { GenerateAiFeedbackType } from 'src/AiFeedback/types/aiFeedback.generate.type';
import { AiFeedback } from 'src/AiFeedback/types/aiFeedback.type';

export abstract class AbstractAiFeedbackService {
  abstract saveFeedback(
    feedback: AiFeedback[],
    submissionId: string,
    marathonId: string,
  ): Promise<void>;
  abstract findAllBySubmissionId(id: string): Promise<AiFeedbacks[]>;
  abstract generateFeedback(
    dto: GenerateAiFeedbackType,
  ): Promise<CorrectionReport>;
  abstract findAllByMarathonId(id: string): Promise<AiFeedbacks[]>;
}

export const AI_FEEDBACK_SERVICE_TOKEN = 'AI_FEEDBACK_SERVICE_TOKEN';
