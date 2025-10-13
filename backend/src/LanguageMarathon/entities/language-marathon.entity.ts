import {
  AiFeedbacks,
  Difficulty,
  Enrollment,
  Leaderboard,
  MarathonProgress,
  ProfessorStats,
  Question,
  Report,
  StudentStats,
} from '@prisma/client';

export class CustomLanguageMarathon {
  id: string;
  title: string;
}

export class RecentMarathons {
  id: string;
  title: string;
  difficulty: Difficulty;
  start_date: Date;
  end_date: Date;
  enrollmentsCount: number;
}

export class RecentMarathonsAndUserStats {
  marathons: RecentMarathons[];
  userStats: Omit<StudentStats, 'userId'> | Omit<ProfessorStats, 'userId'>;
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
