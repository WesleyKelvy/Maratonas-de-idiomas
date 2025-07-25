import { Submission } from '@prisma/client';

export class Question {
  id: string;
  marathonId: string;
  tile: string;
  textOfTheQuestion: string;
  orderNumber: number;

  submission?: Submission[];
}
