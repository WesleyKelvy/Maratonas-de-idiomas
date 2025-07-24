import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Enrollment } from '@prisma/client';
import { AbstractEnrollmentService } from 'src/Enrollment/abstract-services/abstract-enrollment.service';
import {
  AbstractEnrollmentRepository,
  ENROLLEMNT_REPOSITORY_TOKEN,
} from 'src/repositories/abstract/enrollment.repository';

@Injectable()
export class EnrollmentService implements AbstractEnrollmentService {
  constructor(
    @Inject(ENROLLEMNT_REPOSITORY_TOKEN)
    private readonly enrollmentRepository: AbstractEnrollmentRepository,
  ) {}

  async findAllByUserId(id: string): Promise<Enrollment[]> {
    const enrollment = await this.enrollmentRepository.findAllByUserId(id);
    if (!enrollment) {
      throw new NotFoundException(
        `Marathons for this classroom does not exist.`,
      );
    }

    return enrollment;
  }

  async create(id: string, userId: string): Promise<Enrollment> {
    return await this.enrollmentRepository.create(id, userId);
  }
}
