import { Enrollment } from '@prisma/client';

export abstract class AbstractEnrollmentService {
  abstract create(id: string, code: string): Promise<Enrollment>;
  abstract findAllByUserId(code: string): Promise<Enrollment[]>;
  // abstract remove(id: string): Promise<void>;
  // abstract update(
  //   code: string,
  //   updateStatsDto: UpdateLanguageMarathonDto,
  // ): Promise<LanguageMarathon>;
}

export const ENROLLEMENT_SERVICE_TOKEN = 'ENROLLEMENT_SERVICE_TOKEN';
