import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import {
  AbstractUserRepository,
  USER_REPOSITORY_TOKEN,
} from 'src/repositories/abstract/user.repository';
import {
  AbstractProfessorStatsService,
  PROFESSOR_STATS_SERVICE_TOKEN,
} from 'src/Stats/abstract-services/abstract-professor-stats.service';
import {
  AbstractStudentStatsService,
  STUDENT_STATS_SERVICE_TOKEN,
} from 'src/Stats/abstract-services/abstract-student-stats.service';
import { AbstractUserService } from 'src/User/abstract-services/abstract-user.service';
import { CreateUserDto } from 'src/User/dto/create-user.dto';
import { sanitazeUser, SanitedUser } from 'utils/sanitazeUser';
import { EmailService } from '../Mailer/emailService.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ERROR_MESSAGES } from './error/user-service.error';
import { generateAlphanumericCode } from 'src/User/helper/generateAlphanumericCode';

@Injectable()
export class UserService implements AbstractUserService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly AbstractUserRepository: AbstractUserRepository,
    @Inject(PROFESSOR_STATS_SERVICE_TOKEN)
    private readonly professorStatsService: AbstractProfessorStatsService,
    @Inject(STUDENT_STATS_SERVICE_TOKEN)
    private readonly studentStatsService: AbstractStudentStatsService,
    private readonly emailService: EmailService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<SanitedUser> {
    const user = await this.AbstractUserRepository.findByEmail(
      createUserDto.email,
    );

    if (user) {
      throw new ConflictException('Email already in use.');
    }

    const data = await this.AbstractUserRepository.create({
      ...createUserDto,
      confirmationCode: generateAlphanumericCode(9),
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

  async confirmAccount(code: string): Promise<void> {
    const { id, confirmationCode } =
      await this.AbstractUserRepository.findByCode(code);

    if (confirmationCode) {
      throw new ConflictException(ERROR_MESSAGES.INVALID_CODE);
    }

    if (code === confirmationCode) {
      await this.update(id, { accountVerified: true });
    }
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

  async update(id: string, updateUserDto: UpdateUserDto): Promise<SanitedUser> {
    const existingUser = await this.findById(id);

    if (!existingUser) {
      throw new HttpException(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedUser = await this.AbstractUserRepository.update(id, {
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

  async sendResetPasswordEmail(email: string): Promise<string> {
    const user = await this.AbstractUserRepository.findByEmail(email);

    if (!user) throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);

    // Generate Token and Expiration:
    let resetToken: string;
    let tokenExists: User | null;

    do {
      resetToken = randomBytes(32).toString('hex');
      tokenExists = await this.AbstractUserRepository.findbyToken(resetToken);
    } while (tokenExists);

    // Token is valid for 20 minutes
    const tokenExpiration = new Date(Date.now() + 1000 * 60 * 20);

    // Save the reset token and expiration in the database
    await this.AbstractUserRepository.updateByEmail(email, {
      resetToken,
      resetTokenExpiration: tokenExpiration,
    });

    const resetUrl = `https://0.0.0.0:3000/user/reset-password?token=${resetToken}`;

    return resetUrl;

    // // Send the email:
    // await this.emailService.sendResetPasswordEmail(
    //   { email: user.email, name: user.name },
    //   resetUrl,
    // );
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.AbstractUserRepository.findbyToken(token);

    if (!user) throw new BadRequestException(ERROR_MESSAGES.INVALID_TOKEN);

    if (user.resetTokenExpiration < new Date())
      throw new BadRequestException('Token expired');

    await this.AbstractUserRepository.update(user.id, {
      passwordHash: await bcrypt.hash(newPassword, 10),
      resetToken: null,
      resetTokenExpiration: null,
    });
  }
}
