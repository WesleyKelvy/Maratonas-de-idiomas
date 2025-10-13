import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Enrollment } from '@prisma/client';
import { AbstractEnrollmentService } from 'src/Enrollment/abstract-services/abstract-enrollment.service';
import { EnrollmentWithMarathons } from 'src/Enrollment/entities/enrollment.entity';
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
import {
  AbstractUserService,
  USER_SERVICE_TOKEN,
} from 'src/User/abstract-services/abstract-user.service';

@Injectable()
export class EnrollmentService implements AbstractEnrollmentService {
  constructor(
    @Inject(PROFESSOR_STATS_SERVICE_TOKEN)
    private readonly professorStatsService: AbstractProfessorStatsService,
    @Inject(USER_SERVICE_TOKEN)
    private readonly userService: AbstractUserService,
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

  async findAllByUserId(id: string): Promise<EnrollmentWithMarathons[]> {
    const enrollment = await this.enrollmentRepository.findAllByUserId(id);
    if (!enrollment) {
      throw new NotFoundException('Marathons for this classroom do not exist.');
    }

    return enrollment;
  }

  async findOne(code: string, userId: string): Promise<Enrollment> {
    return await this.enrollmentRepository.findOne(code, userId);
  }

  async create(userId: string, code: string): Promise<Enrollment> {
    const user = await this.userService.findById(userId);
    if (!user) throw new BadRequestException('User not found');

    const data = await this.findOne(code, userId);
    if (data) throw new ConflictException('Enrollment already done!');

    const {
      id: marathonId,
      code: marathonCode,
      created_by,
    } = await this.marathonService.findOneByCode(code);

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
