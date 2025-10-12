import { $Enums } from '@prisma/client';

type EnrollmentIds = {
  id: string;
};

type CustomLanguageMarathonWithEnrollments = {
  id: string;
  title: string;
  description: string;
  difficulty: $Enums.Difficulty;
  start_date: Date;
  end_date: Date | null;
  enrollments: EnrollmentIds[];
};

type CustomLanguageMarathon = Omit<
  CustomLanguageMarathonWithEnrollments,
  'enrollment'
>;

export class ClassroomWithLanguageMarathon {
  id: string;
  name: string;
  invite_expiration?: Date;
  created_at: Date;
  created_by: string;
  marathons?: CustomLanguageMarathon[];
}

// findONe
export class ClassroomWithMarathonsAndEnrollments {
  id: string;
  name: string;
  invite_expiration?: Date;
  created_at: Date;
  created_by: string;
  marathons?: CustomLanguageMarathonWithEnrollments[];
}

export class ClassroomWithMarathonIds {
  id: string;
  name: string;
  invite_expiration?: Date;
  created_at: Date;
  created_by: string;
  marathons: { id: string }[];
}

export class Classroom {
  id: string;
  name: string;
  invite_expiration?: Date;
  created_at: Date;
  created_by: string;
}
