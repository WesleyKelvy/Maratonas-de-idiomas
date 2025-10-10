import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
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
import { CreateEnrollmentDto } from 'src/Enrollment/dto/enrollment.create.dto';

@UseGuards(RolesGuard)
@Roles(Role.Student)
@Controller('/enrollment')
export class EnrollmentController {
  constructor(
    @Inject(ENROLLMENT_SERVICE_TOKEN)
    private readonly enrollmentService: AbstractEnrollmentService,
  ) {}

  @Post(':marathonCode')
  @HttpCode(HttpStatus.CREATED)
  create(
    @CurrentUser() user: UserFromJwt,
    @Body() { code }: CreateEnrollmentDto,
  ): Promise<Enrollment> {
    // console.log('controller: ', code);
    return this.enrollmentService.create(user.id, code);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Student)
  @Get('user/:id')
  findAllByUserId(@CurrentUser('id') id: string): Promise<Enrollment[]> {
    return this.enrollmentService.findAllByUserId(id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Professor)
  @Get('marathon/marathonId')
  findAllEnrollmentsByMarathonId(marathonId: string): Promise<Enrollment[]> {
    return this.enrollmentService.findAllEnrollmentsByMarathonId(marathonId);
  }
}
