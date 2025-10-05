export type MarathonProgressData = {
  id: string;
  user_id: string;
  marathon_id: string;
  current_question_id: number | null;
  draft_answer: string;
  started_at: Date;
  last_updated_at: Date;
  completed: boolean;
  completed_at: Date | null;
};

export type CreateMarathonProgress = {
  user_id: string;
  marathon_id: string;
  current_question_id?: number;
};

export type UpdateMarathonProgress = {
  current_question_id?: number;
  draft_answer?: string;
  completed?: boolean;
};

export type MarathonProgressWithTime = MarathonProgressData & {
  time_remaining: number;
  time_elapsed: number;
  is_expired: boolean;
};
