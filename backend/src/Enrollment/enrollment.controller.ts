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
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { ENROLLEMENT_SERVICE_TOKEN } from 'src/Enrollment/abstract-services/abstract-enrollment.service';
import { AbstractEnrollmentRepository } from 'src/repositories/abstract/enrollment.repository';

@UseGuards()
@Controller('/student/enrollment/:marathonId')
export class EnrollmentController {
  constructor(
    @Inject(ENROLLEMENT_SERVICE_TOKEN)
    private readonly enrollmentService: AbstractEnrollmentRepository,
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
