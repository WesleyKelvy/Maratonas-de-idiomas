import {
  AiFeedbacks,
  Difficulty,
  Enrollment,
  Leaderboard,
  MarathonProgress,
  Question,
  Report,
} from '@prisma/client';

export class CustomLanguageMarathon {
  id: string;
  title: string;
}

export class LanguageMarathon {
  id: string;
  code: string;
  title: string;
  description?: string;
  context: string;
  difficulty: Difficulty;
  timeLimit: number;
  start_date: Date;
  end_date?: Date;
  number_of_questions: number;
  leaderboard_generated: boolean;

  classroom_id: string;
  created_by: string;

  // Relações
  questions?: Question[];
  enrollments?: Enrollment[];
  leaderboard?: Leaderboard[];
  AiFeedbacks?: AiFeedbacks[];
  Report?: Report;
  progress?: MarathonProgress[];
}
