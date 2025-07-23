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
import { AbstractUserRepository } from 'src/repositories/abstract/user.repository';
import { EmailService } from '../mailer/emailService.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ERROR_MESSAGES } from './error/user-service.error';
import { sanitazeUser, SanitedUser } from 'utils/sanitazeUser';

export const USER_REPOSITORY_TOKEN = 'AbstractUserRepository';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly AbstractUserRepository: AbstractUserRepository,
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

  // async cancelSubscription(id: string): Promise<User> {
  //   try {
  //     // Fetch user details:
  //     const user: User = await this.findById(id);

  //     // Return if user dosen't have a subscription!
  //     // if (user.subscriptionId === null) {
  //     //   throw new HttpException(
  //     //     ERROR_MESSAGES.NO_ACTIVE_SUBSCRIPTION,
  //     //     HttpStatus.BAD_REQUEST,
  //     //   );
  //     // }

  //     // Cancel subscription:
  //     const canceledSubscription = await this.paymentService.cancelSubscription(
  //       user.subscriptionId,
  //     );

  //     // if (canceledSubscription.status !== 'canceled') {
  //     //   throw new HttpException(
  //     //     STRIPE_ERRORS.SUBSCRIPTION_CANCELATION_FAILED(user.subscriptionId),
  //     //     HttpStatus.INTERNAL_SERVER_ERROR,
  //     //   );
  //     // }

  //     // Update user's subscription status in the database
  //     const updatedUser: User = await this.prisma.user.update({
  //       where: { id },
  //       data: { subscriptionId: null },
  //     });

  //     // if (updatedUser.subscriptionId !== null) {
  //     //   throw new HttpException(
  //     //     ERROR_MESSAGES.SUBSCRIPTION_UPDATE_FAILED_IN_CANCEL_SUBSCRIPTION,
  //     //     HttpStatus.INTERNAL_SERVER_ERROR,
  //     //   );
  //     // }

  //     return updatedUser;
  //   } catch (error) {
  //     throw new HttpException(
  //       error.message,
  //       error.status || HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  // async refundSubscription(id: string): Promise<User> {
  //   try {
  //     // Fetch user details:
  //     const user = await this.findById(id);

  //     // Validate if user has an active subscription
  //     // if (!user.subscriptionId) {
  //     //   throw new HttpException(
  //     //     ERROR_MESSAGES.NO_ACTIVE_SUBSCRIPTION,
  //     //     HttpStatus.BAD_REQUEST,
  //     //   );
  //     // }

  //     // Cancel subscription:
  //     const canceledSubscription =
  //       await this.paymentService.refundLastPaymentIfEligible(
  //         user.subscriptionId,
  //       );

  //     // if (canceledSubscription.status !== 'succeeded') {
  //     //   throw new HttpException(
  //     //     STRIPE_ERRORS.SUBSCRIPTION_CANCELATION_FAILED(user.subscriptionId),
  //     //     HttpStatus.INTERNAL_SERVER_ERROR,
  //     //   );
  //     // }

  //     // Update user's subscription status in the database:
  //     const updatedUser: User = await this.prisma.user.update({
  //       where: { id },
  //       data: { subscriptionId: null },
  //     });

  //     // if (updatedUser.subscriptionId !== null) {
  //     //   throw new HttpException(
  //     //     ERROR_MESSAGES.SUBSCRIPTION_UPDATE_FAILED_IN_REFUND,
  //     //     HttpStatus.INTERNAL_SERVER_ERROR,
  //     //   );
  //     // }

  //     return { ...updatedUser, password: undefined };
  //   } catch (error) {
  //     throw new HttpException(
  //       error.message,
  //       error.status || HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }
}

// async makeSubscription(id: string) {
//   // Fetch user details:
//   const user: User = await this.findById(id);

//   if (user.subscriptionId !== null) {
//     throw new HttpException(
//       ERROR_MESSAGES.USER_ALREADY_HAS_A_SUBSCRIPTION,
//       HttpStatus.BAD_REQUEST,
//     );
//   }

//   // Make subscription:
//   const subscriptionURL: string =
//     await this.paymentService.createCheckoutSession({
//       email: user.email,
//       isSubscription: true,
//     });

//   return subscriptionURL;
// }

// if (subscription.status !== 'complete') {
//   throw new HttpException(
//     STRIPE_ERRORS.CHECKOUT_NOT_COMPLETED,
//     HttpStatus.REQUEST_TIMEOUT,
//   );
// }

// Update user's subscription status in the database:
// const updatedUser = await this.prisma.user.update({
//   where: { id },
//   data: {
//     subscriptionId: subscription.id,
//   },
// });

// if (updatedUser.subscriptionId === null) {
//   throw new HttpException(
//     ERROR_MESSAGES.SUBSCRIPTION_UPDATE_FAILED_IN_SUBSCRIPTION_PURCHASE,
//     HttpStatus.BAD_REQUEST,
//   );
// }

// return { ...updatedUser, password: undefined };
