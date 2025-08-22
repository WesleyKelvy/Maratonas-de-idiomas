import { Enrollment } from '@prisma/client';

export abstract class AbstractEnrollmentService {
  abstract create(userId: string, marathon_id: string): Promise<Enrollment>;
  abstract findAllByUserId(userId: string): Promise<Enrollment[]>;
  abstract findOne(marathon_id: string, userId: string): Promise<Enrollment>;
  // abstract remove(id: string): Promise<void>;
  // abstract update(
  //   code: string,
  //   updateStatsDto: UpdateLanguageMarathonDto,
  // ): Promise<LanguageMarathon>;
}

export const ENROLLMENT_SERVICE_TOKEN = 'ENROLLMENT_SERVICE_TOKEN';
