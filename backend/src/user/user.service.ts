import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import {
  AbstractUserRepository,
  USER_REPOSITORY_TOKEN,
} from 'src/repositories/abstract/user.repository';
import {
  AbstractProfessorStatsService,
  PROFESSOR_STATS_SERVICE_TOKEN,
} from 'src/stats/abstract-services/abstract-professor-stats.service';
import {
  AbstractStudentStatsService,
  STUDENT_STATS_SERVICE_TOKEN,
} from 'src/stats/abstract-services/abstract-student-stats.service';
import { sanitazeUser, SanitedUser } from 'utils/sanitazeUser';
import { EmailService } from '../mailer/emailService.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ERROR_MESSAGES } from './error/user-service.error';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly AbstractUserRepository: AbstractUserRepository,
    @Inject(PROFESSOR_STATS_SERVICE_TOKEN)
    private readonly professorStatsService: AbstractProfessorStatsService,
    @Inject(STUDENT_STATS_SERVICE_TOKEN)
    private readonly studentStatsService: AbstractStudentStatsService,
    private readonly emailService: EmailService,
  ) {}

  async create(createUserDto: Prisma.UserCreateInput): Promise<SanitedUser> {
    const rawUser = await this.AbstractUserRepository.findByEmail(
      createUserDto.email,
    );

    if (rawUser) {
      throw new ConflictException('Email already in use.');
    }

    const data = await this.AbstractUserRepository.create({
      ...createUserDto,
      passwordHash: await bcrypt.hash(createUserDto.passwordHash, 10),
    });

    if (createUserDto.role === 'Professor') {
      await this.professorStatsService.create(data.id);
    } else {
      await this.studentStatsService.create(data.id);
    }

    // await this.emailService.sendAccountCreatedEmail({
    //   email: createdUser.email,
    //   name: createdUser.name,
    // });

    return sanitazeUser(data);
  }

  async findByEmail(email: string): Promise<SanitedUser> {
    const existingUser = await this.AbstractUserRepository.findByEmail(email);

    if (!existingUser) {
      throw new HttpException(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return sanitazeUser(existingUser);
  }

  async findById(id: string): Promise<SanitedUser> {
    const existingUser = await this.AbstractUserRepository.findOne(id);

    if (!existingUser) {
      throw new HttpException(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return sanitazeUser(existingUser);
  }

  async update(
    email: string,
    updateUserDto: UpdateUserDto,
  ): Promise<SanitedUser> {
    const existingUser = await this.findByEmail(email);

    if (!existingUser) {
      throw new HttpException(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedUser = await this.AbstractUserRepository.updateByEmail(email, {
      ...updateUserDto,
    });

    return sanitazeUser(updatedUser);
  }

  async remove(id: string): Promise<void> {
    try {
      // Send email
      // await this.emailService.sendAccountDeletionEmail({
      //   email: user.email,
      //   name: user.name,
      // });

      const existingUser = await this.findById(id);

      if (!existingUser) {
        throw new HttpException(
          ERROR_MESSAGES.USER_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }

      // Delete user
      await this.AbstractUserRepository.remove(id);

      return;
    } catch (error) {
      // console.log(error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async sendResetPasswordEmail(email: string): Promise<void> {
    const rawUser = await this.AbstractUserRepository.findByEmail(email);

    if (!rawUser) throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);

    // Generate Token and Expiration:
    let resetToken: string;
    let tokenExists: User | null;

    do {
      resetToken = randomBytes(32).toString('hex');
      tokenExists = await this.AbstractUserRepository.findbyToken(resetToken);
    } while (tokenExists);

    // Token is valid for 1 hour
    const tokenExpiration = new Date(Date.now() + 1000 * 60 * 60);

    // Save the reset token and expiration in the database
    await this.AbstractUserRepository.updateByEmail(email, {
      resetToken,
      resetTokenExpiration: tokenExpiration,
    });

    // Building URL:
    // const resetUrl = `https://0.0.0.0:3000/user/reset-password?token=${resetToken}`;

    // // Send the email:
    // await this.emailService.sendResetPasswordEmail(
    //   { email: user.email, name: user.name },
    //   resetUrl,
    // );
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const rawUser = await this.AbstractUserRepository.findbyToken(token);

    if (!rawUser) throw new BadRequestException(ERROR_MESSAGES.INVALID_TOKEN);

    if (rawUser.resetTokenExpiration < new Date())
      throw new BadRequestException('Token expired');

    await this.AbstractUserRepository.update(rawUser.id, {
      passwordHash: await bcrypt.hash(newPassword, 10),
      resetToken: null,
      resetTokenExpiration: null,
    });
  }

  async joinMarathon(id): Promise<void> {
    return;
  }
}
