import { Enrollment } from '@prisma/client';

export abstract class AbstractEnrollmentRepository {
  abstract create(id: string, userId: string): Promise<Enrollment>;
  abstract findAllByUserId(userId: string): Promise<Enrollment[] | null>;
  // abstract remove(code: string): Promise<void>;
}

export const ENROLLEMNT_REPOSITORY_TOKEN = 'ENROLLEMNT_REPOSITORY_TOKEN';
