import { User } from '@prisma/client';

export class Leaderboard {
  id: string;
  marathonId: string;
  userId: string;
  score: number;
  position: number;
  user?: User; // Optional: for returning user data
}
