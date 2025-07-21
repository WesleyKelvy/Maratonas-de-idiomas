import { Role } from '@prisma/client';

export class User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  birthdate: string;
  city: string;
  occupation: string;
  role: Role;
  resetToken: string | null;
  resetTokenExpiration: Date | null;
}
