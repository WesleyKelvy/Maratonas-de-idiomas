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
import { Enrollment, Role } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import {
  AbstractEnrollmentService,
  ENROLLMENT_SERVICE_TOKEN,
} from 'src/Enrollment/abstract-services/abstract-enrollment.service';

@UseGuards(RolesGuard)
@Roles(Role.Student)
@Controller('/student/enrollment/:marathonCode')
export class EnrollmentController {
  constructor(
    @Inject(ENROLLMENT_SERVICE_TOKEN)
    private readonly enrollmentService: AbstractEnrollmentService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @CurrentUser() user: UserFromJwt,
    @Param('marathonCode') code: string,
  ): Promise<Enrollment> {
    console.log('controller: ', code);
    return this.enrollmentService.create(user.id, code);
  }

  @Get()
  findAllByUserId(@CurrentUser('id') id: string): Promise<Enrollment[]> {
    return this.enrollmentService.findAllByUserId(id);
  }
}
