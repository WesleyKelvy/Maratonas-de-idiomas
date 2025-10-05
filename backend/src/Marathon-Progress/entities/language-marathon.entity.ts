import { Enrollment, Leaderboard, Question } from '@prisma/client';

export class LanguageMarathon {
  id: string;
  title: string;
  description?: string;
  context: string;
  difficulty?: string;
  timeLimit: Date;
  start_date: Date;
  end_date: Date;

  classroom_code: string;
  created_by: string;

  questions?: Question[];
  enrollments?: Enrollment[];
  leaderboard?: Leaderboard[];
}
