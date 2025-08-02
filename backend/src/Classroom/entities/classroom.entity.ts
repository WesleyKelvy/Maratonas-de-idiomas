import { LanguageMarathon } from '@prisma/client';

export class Classroom {
  id: string;
  name: number;
  code: number;
  invite_expiration: number;
  created_by: string;
  marathons?: LanguageMarathon[];
}
