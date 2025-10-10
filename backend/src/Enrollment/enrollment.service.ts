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
  AbstractLanguageMarathonService,
  LANGUAGE_MARATHON_SERVICE_TOKEN,
} from 'src/LanguageMarathon/abstract-services/abstract-language-marathon.service';
import {
  AbstractEnrollmentRepository,
  ENROLLMENT_REPOSITORY_TOKEN,
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
    @Inject(LANGUAGE_MARATHON_SERVICE_TOKEN)
    private readonly marathonService: AbstractLanguageMarathonService,
    @Inject(ENROLLMENT_REPOSITORY_TOKEN)
    private readonly enrollmentRepository: AbstractEnrollmentRepository,
  ) {}

  async findAllEnrollmentsByMarathonId(
    marathonId: string,
  ): Promise<Enrollment[]> {
    const enrollment =
      await this.enrollmentRepository.findAllEnrollmentsByMarathonId(
        marathonId,
      );
    if (!enrollment) {
      throw new NotFoundException(
        'Enrollments for this marathon does not exist.',
      );
    }

    return enrollment;
  }

  async findAllByUserId(id: string): Promise<Enrollment[]> {
    const enrollment = await this.enrollmentRepository.findAllByUserId(id);
    if (!enrollment) {
      throw new NotFoundException('Marathons for this classroom do not exist.');
    }

    return enrollment;
  }

  async findOne(marathonId: string, userId: string): Promise<Enrollment> {
    return await this.enrollmentRepository.findOne(marathonId, userId);
  }

  async create(userId: string, code: string): Promise<Enrollment> {
    const data = await this.findOne(code, userId);

    if (data) throw new ConflictException('Enrollment already done!');

    const { id: marathonId, code: marathonCode } =
      await this.marathonService.findOneByCode(code);

    const { created_by } =
      await this.classroomService.findOneByMarathonId(code);

    await this.professorStatsService.incrementTotalStudentsProfessorStats(
      created_by,
    );

    return await this.enrollmentRepository.create(
      userId,
      marathonId,
      marathonCode,
    );
  }
}
