import { $Enums } from '@prisma/client';

type CustomLanguageMarathos = {
  id: string;
  title: string;
  description: string;
  difficulty: $Enums.Difficulty;
  start_date: Date;
  end_date: Date | null;
  number_of_questions: number;
  timeLimit: number;
  code: string;
};

export class Enrollment {
  id: string;
  userId: string;
  marathonId: string;
}

export type EnrollmentWithMarathons = {
  id: string;
  marathon: CustomLanguageMarathos;
};
