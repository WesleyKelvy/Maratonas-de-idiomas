import { LanguageMarathon } from '@prisma/client';

export class Classroom {
  id: string;
  name: string;
  invite_expiration?: Date;
  created_at: Date;
  created_by: string;
  marathons?: LanguageMarathon[];
}

export class ClassroomWithMarathons {
  id: string;
  name: string;
  invite_expiration?: Date;
  created_at: Date;
  created_by: string;
  marathons?: LanguageMarathon[];
}

export class ClassroomWithMarathonIds {
  id: string;
  name: string;
  invite_expiration?: Date;
  created_at: Date;
  created_by: string;
  marathons: { id: string }[];
}
