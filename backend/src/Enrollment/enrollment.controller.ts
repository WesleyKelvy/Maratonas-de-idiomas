import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Enrollment } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { StudentGuard } from 'src/auth/guards/student.guard';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import {
  AbstractEnrollmentService,
  ENROLLMENT_SERVICE_TOKEN,
} from 'src/Enrollment/abstract-services/abstract-enrollment.service';

@UseGuards(StudentGuard)
@Controller('/student/enrollment/:marathonId')
export class EnrollmentController {
  constructor(
    @Inject(ENROLLMENT_SERVICE_TOKEN)
    private readonly enrollmentService: AbstractEnrollmentService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @CurrentUser() user: UserFromJwt,
    @Param('marathonId') id: string,
  ): Promise<Enrollment> {
    return this.enrollmentService.create(id, user.id);
  }

  @Get()
  findAllByUserId(@Param('marathonId') id: string): Promise<Enrollment[]> {
    return this.enrollmentService.findAllByUserId(id);
  }
}
