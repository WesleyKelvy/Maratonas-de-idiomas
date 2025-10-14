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

export class SubmissionWithMarathonAndQuestionTitle {
  id: string;
  question_id: number;
  answer: string;
  corrected_by_ai: boolean;
  corrected_answer: string | null;
  score: number;
  marathon: { title: string };
  question: { title: string };
}
