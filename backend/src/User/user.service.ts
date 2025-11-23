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
import { AuthService } from 'src/auth/auth.service';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
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
import { UserBasicInfoDto } from 'src/User/dto/get-users.dto';
import { generateAlphanumericCode } from 'src/User/helper/generateAlphanumericCode';
import { sanitazeUser, SanitedUser } from 'utils/sanitazeUser';
import { EmailService } from '../Mailer/emailService.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ERROR_MESSAGES } from './error/user-service.error';

@Injectable()
export class UserService implements AbstractUserService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: AbstractUserRepository,
    @Inject(PROFESSOR_STATS_SERVICE_TOKEN)
    private readonly professorStatsService: AbstractProfessorStatsService,
    @Inject(STUDENT_STATS_SERVICE_TOKEN)
    private readonly studentStatsService: AbstractStudentStatsService,
    private readonly emailService: EmailService,
    private readonly authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<string> {
    // get user data
    const user = await this.userRepository.findByEmail(createUserDto.email);

    if (user) {
      throw new ConflictException('Email already in use.');
    }

    // separate passard from dto
    const { password, ...restOfUserData } = createUserDto;

    // build user data
    const data = await this.userRepository.create({
      ...restOfUserData,
      confirmationCode: generateAlphanumericCode(9),
      passwordHash: await bcrypt.hash(password, 10),
    });

    // create stats
    if (createUserDto.role === 'Professor') {
      await this.professorStatsService.create(data.id);
    } else {
      await this.studentStatsService.create(data.id);
    }

    // send email
    await this.emailService.sendAccountCreatedEmail({
      email: data.email,
      name: data.name,
      code: data.confirmationCode,
    });

    // Building the Jwt payload and send
    const loginData: UserFromJwt = {
      email: data.name,
      id: data.id,
      name: data.name,
      role: data.role,
      accountVerified: data.accountVerified,
    };

    const { accessToken } = this.authService.login(loginData);

    return accessToken;
  }

  async confirmAccount(userEmail: string, code: string): Promise<string> {
    // get user data
    const { id, name, confirmationCode, email, role } =
      await this.userRepository.findByEmail(userEmail);

    if (!confirmationCode || code !== confirmationCode) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_CODE);
    }

    // update user account
    await this.userRepository.manageUserAccount(id, {
      accountVerified: true,
      confirmationCode: null,
    });

    // Building the Jwt payload and send
    const loginData: UserFromJwt = {
      email,
      id,
      name,
      role,
      accountVerified: true,
    };

    const { accessToken } = this.authService.login(loginData);

    return accessToken;
  }

  async findByEmail(email: string): Promise<SanitedUser> {
    const existingUser = await this.userRepository.findByEmail(email);

    if (!existingUser) {
      throw new HttpException(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return sanitazeUser(existingUser);
  }

  async findById(id: string): Promise<SanitedUser> {
    const existingUser = await this.userRepository.findOne(id);

    if (!existingUser) {
      throw new HttpException(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return sanitazeUser(existingUser);
  }

  async update(
    id: string,
    updateUserDto: Partial<UpdateUserDto>,
  ): Promise<SanitedUser> {
    const existingUser = await this.findById(id);

    if (!existingUser) {
      throw new HttpException(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedUser = await this.userRepository.updateById(id, {
      ...updateUserDto,
    });

    return sanitazeUser(updatedUser);
  }

  // remove method does not delete the user,
  // just change the accountDeactiva to true
  async remove(id: string): Promise<void> {
    const existingUser = await this.findById(id);
    if (!existingUser) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    // Send email
    await this.emailService.sendAccountDeletionEmail({
      email: existingUser.email,
      name: existingUser.name,
    });

    await this.userRepository.remove(id);
  }

  async sendResetPasswordByEmail(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);

    if (
      user.resetRequestedAt &&
      user.resetRequestedAt > new Date(Date.now() - 60_000)
    ) {
      throw new BadRequestException('Wait a moment and try again later.');
    }

    // Generate Token and Expiration:
    let resetToken: string;
    let tokenExists: User | null;

    do {
      resetToken = randomBytes(32).toString('hex');
      tokenExists = await this.userRepository.findbyToken(resetToken);
    } while (tokenExists);

    // Token is valid for 20 minutes
    const tokenExpiration = new Date(Date.now() + 1000 * 60 * 20);

    await this.userRepository.manageUserAccount(user.id, {
      resetToken,
      resetTokenExpiration: tokenExpiration,
      resetRequestedAt: new Date(),
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Send the email
    await this.emailService.sendResetPasswordEmail(
      { email: user.email, name: user.name },
      resetUrl,
    );
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findbyToken(token);

    if (!user) throw new BadRequestException(ERROR_MESSAGES.INVALID_TOKEN);

    if (user.resetTokenExpiration < new Date())
      throw new BadRequestException('Token expired');

    await this.userRepository.manageUserAccount(user.id, {
      passwordHash: await bcrypt.hash(newPassword, 10),
      resetToken: null,
      resetTokenExpiration: null,
      resetRequestedAt: null,
    });
  }

  async getUsersByIds(userIds: string[]): Promise<UserBasicInfoDto[]> {
    if (!userIds || userIds.length === 0) {
      throw new HttpException(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.userRepository.findManyByIds(userIds);
  }

  async resendVerifingCode(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);

    const code = generateAlphanumericCode(9);

    await this.userRepository.manageUserAccount(user.id, {
      confirmationCode: code,
    });

    await this.emailService.resendVerifingCodeTemplate({
      email: user.email,
      name: user.name,
      code,
    });
  }
}
