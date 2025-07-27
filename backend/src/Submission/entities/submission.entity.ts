import { AiFeedbacks } from '@prisma/client';

export class Submission {
  id: string;
  questionId: string;
  userId: string;
  answer: string;
  correctedByAI?: boolean;
  score: number;

  AiFeedbacks?: AiFeedbacks;
}
