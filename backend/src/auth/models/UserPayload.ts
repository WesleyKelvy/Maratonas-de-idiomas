import { Role } from '@prisma/client';

export interface UserPayload {
  id: string;
  sub: string;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
  role: Role;
}
