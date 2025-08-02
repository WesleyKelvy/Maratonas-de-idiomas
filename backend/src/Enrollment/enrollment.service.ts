import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Enrollment } from '@prisma/client';
import {
  AbstractClassroomService,
  CLASSROOM_SERVICE_TOKEN,
} from 'src/Classroom/abstract-services/abstract-classrom.service';
import { AbstractEnrollmentService } from 'src/Enrollment/abstract-services/abstract-enrollment.service';
import {
  AbstractEnrollmentRepository,
  ENROLLEMNT_REPOSITORY_TOKEN,
} from 'src/repositories/abstract/enrollment.repository';
import {
  AbstractProfessorStatsService,
  PROFESSOR_STATS_SERVICE_TOKEN,
} from 'src/Stats/abstract-services/abstract-professor-stats.service';

@Injectable()
export class EnrollmentService implements AbstractEnrollmentService {
  constructor(
    @Inject(PROFESSOR_STATS_SERVICE_TOKEN)
    private readonly professorStatsService: AbstractProfessorStatsService,
    @Inject(CLASSROOM_SERVICE_TOKEN)
    private readonly classroomService: AbstractClassroomService,
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

  async findOne(marathon_id: string, userId: string): Promise<Enrollment> {
    return await this.enrollmentRepository.findOne(marathon_id, userId);
  }

  async create(userId: string, marathon_id: string): Promise<Enrollment> {
    const data = await this.findOne(marathon_id, userId);

    if (data) {
      throw new ConflictException('Enrollemt already done!');
    }

    const { created_by } =
      await this.classroomService.findOneByMarathonId(marathon_id);

    await this.professorStatsService.incrementTotalStudentsProfessorStats(
      created_by,
    );

    return await this.enrollmentRepository.create(userId, marathon_id);
  }
}
