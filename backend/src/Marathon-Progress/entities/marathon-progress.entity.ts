import { LanguageMarathon, User } from '@prisma/client';

export class MarathonProgress {
  id: string;
  user_id: string;
  marathon_id: string;
  current_question_id?: number;
  draft_answer: string;
  started_at: Date;
  last_updated_at: Date;
  completed: boolean;
  completed_at?: Date;

  user?: User;
  marathon?: LanguageMarathon;
}
