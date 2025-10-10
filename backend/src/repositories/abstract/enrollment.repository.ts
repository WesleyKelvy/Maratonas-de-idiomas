import { Enrollment } from '@prisma/client';

export abstract class AbstractEnrollmentRepository {
  abstract create(
    user_id: string,
    marathon_id: string,
    code: string,
  ): Promise<Enrollment>;
  abstract findAllByUserId(userId: string): Promise<Enrollment[] | null>;
  abstract findOne(
    marathonId: string,
    userId: string,
  ): Promise<Enrollment | null>;
  abstract findAllEnrollmentsByMarathonId(
    marathonId: string,
  ): Promise<Enrollment[] | null>;
}

export const ENROLLMENT_REPOSITORY_TOKEN = 'ENROLLMENT_REPOSITORY_TOKEN';
