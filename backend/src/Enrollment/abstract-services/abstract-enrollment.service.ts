import { Enrollment } from '@prisma/client';

export abstract class AbstractEnrollmentService {
  abstract create(userId: string, marathon_id: string): Promise<Enrollment>;
  abstract findAllByUserId(userId: string): Promise<Enrollment[]>;
  abstract findOne(marathonId: string, userId: string): Promise<Enrollment>;
  abstract findAllEnrollmentsByMarathonId(
    marathonId: string,
  ): Promise<Enrollment[]>;
}

export const ENROLLMENT_SERVICE_TOKEN = 'ENROLLMENT_SERVICE_TOKEN';
