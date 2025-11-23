import { Role } from '@prisma/client';

export interface UserFromJwt {
  id: string;
  email: string;
  name: string;
  role: Role;
  accountVerified: boolean;
}
