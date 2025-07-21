import { ConflictException, HttpException } from '@nestjs/common/exceptions';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { EmailService } from '../../mailer/emailService.service';
import { MailerModule } from '../../mailer/mailer.module';
import { PaymentModule } from '../../payment/payment.module';
import { PaymentService } from '../../payment/payment.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { PrismaService } from '../../prisma/prisma.service';
import { RequestUser } from '../../property/models/request-user';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserService } from '../user.service';

describe('UserService', () => {
  let prisma: PrismaService;
  let service: UserService;
  let emailService: EmailService;
  let paymentService: PaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, MailerModule, PaymentModule],
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendSubscriptionCancellationEmail: jest.fn(),
            sendAccountDeletionEmail: jest.fn(),
            sendResetPasswordEmail: jest.fn(),
            sendAccountCreatedEmail: jest.fn(),
            subscriptionSuccessEmail: jest.fn(),
            sendRefundNotificationEmail: jest.fn(),
          },
        },
        {
          provide: PaymentService,
          useValue: {
            cancelSubscription: jest.fn(),
            createCheckoutSession: jest.fn(),
            refundLastPaymentIfEligible: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
    emailService = module.get<EmailService>(EmailService);
    paymentService = module.get<PaymentService>(PaymentService);

    // Mocked hashed passwords to always return the same hash
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('mockHashedPassword' as never);

    // Mock randomBytes to always return the same reset token
    jest
      .spyOn(require('crypto'), 'randomBytes')
      .mockResolvedValue('mockResetToken');

    // Payment Mock
    jest.spyOn(paymentService, 'cancelSubscription').mockResolvedValue({
      name: 'John',
      email: 'testJohn@email.com',
      subscriptionStatus: 'canceled',
    });

    // jest.spyOn(paymentService, 'createCheckoutSession').mockResolvedValue({
    //   id: 'mocked-session-id',
    //   url: 'https://example.com/checkout',
    //   status: 'complete',
    // } as Stripe.Checkout.Session);

    // jest
    //   .spyOn(paymentService, 'refundLastPaymentIfEligible')
    //   .mockResolvedValue({
    //     status: 'succeeded',
    //   } as Stripe.Refund);

    // Old mocks:
    // (paymentService.cancelSubscription as jest.Mock).mockResolvedValue({
    //   status: 'canceled',
    // });
    // (paymentService.createCheckoutSession as jest.Mock).mockResolvedValue({
    //   id: 'mocked-session-id',
    //   url: 'https://example.com/checkout',
    // });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password123',
        birthdate: '1990-01-01',
        city: 'Test City',
        occupation: 'Developer',
      };

      const mockResponse: User = {
        id: 'user-id',
        resetToken: null,
        resetTokenExpiration: null,
        subscriptionId: null,
        createdAt: new Date(),
        ...createUserDto,
        password: undefined,
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prisma.user, 'create').mockResolvedValue(mockResponse);
      jest.spyOn(emailService, 'sendAccountCreatedEmail').mockResolvedValue();

      const result = await service.create(createUserDto);

      expect(result).toEqual(mockResponse);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          ...createUserDto,
          password: await bcrypt.hash(createUserDto.password, 10),
        },
      });
      expect(emailService.sendAccountCreatedEmail).toHaveBeenCalledTimes(1);
      expect(prisma.user.create).toHaveBeenCalledTimes(1);
    });
    it('should throw ConflictException if email already exists', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password123',
        birthdate: '1990-01-01',
        city: 'Test City',
        occupation: 'Developer',
      };

      const mockResponse: User = {
        id: 'user-id',
        resetToken: null,
        resetTokenExpiration: null,
        subscriptionId: null,
        createdAt: new Date(),
        ...createUserDto,
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockResponse);

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const mockResponse: User = {
        id: 'user-id',
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password123',
        createdAt: new Date(),
        resetToken: null,
        resetTokenExpiration: null,
        subscriptionId: null,
        birthdate: '1990-01-01',
        city: 'Test City',
        occupation: 'Developer',
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockResponse);

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual({ ...mockResponse, password: undefined });
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockResponse.email },
      });
      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
    });
    it('should throw HttpException if user not found by email', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(service.findByEmail('test@example.com')).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('findById', () => {
    it('should find a user by ID', async () => {
      const mockResponse: User = {
        id: 'user-id',
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password123',
        createdAt: new Date(),
        resetToken: null,
        resetTokenExpiration: null,
        subscriptionId: null,
        birthdate: '1990-01-01',
        city: 'Test City',
        occupation: 'Developer',
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockResponse);

      const result = await service.findById(mockResponse.id);

      expect(result).toEqual({ ...mockResponse, password: undefined });
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockResponse.id },
      });
      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
    });
    it('should throw HttpException if user not found by ID', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(service.findById('user-Id')).rejects.toThrow(HttpException);
    });
  });

  describe('update', () => {
    it('should update a user by ID', async () => {
      const updateUserDto = { name: 'Updated Name' };

      const mockUser: User = {
        id: 'user-id',
        name: updateUserDto.name || 'Default name',
        email: 'test@example.com',
        password: 'password123',
        createdAt: new Date(),
        resetToken: null,
        resetTokenExpiration: null,
        subscriptionId: null,
        birthdate: '1990-01-01',
        city: 'Test City',
        occupation: 'Developer',
      };

      jest.spyOn(service, 'findById').mockResolvedValue(mockUser);
      jest.spyOn(prisma.user, 'update').mockResolvedValue(mockUser);

      const result = await service.update('user-id', updateUserDto);

      expect(result).toEqual({
        ...mockUser,
        password: undefined,
      });
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: updateUserDto,
      });
    });
    it('should throw HttpException if user is not found in update', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(
        service.update('non-existing-id', { name: 'Updated Name' }),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('remove', () => {
    it('should remove a user by ID with NO SUBSCRIPTION', async () => {
      const mockUserbyJWT: RequestUser = {
        id: 'user-id',
        name: 'John Doe',
        email: 'test@example.com',
        hasSubscription: false,
      };
      const mockUser: User = {
        id: 'user-id',
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password123',
        createdAt: new Date(),
        resetToken: null,
        resetTokenExpiration: null,
        subscriptionId: 'id',
        birthdate: '1990-01-01',
        city: 'Test City',
        occupation: 'Developer',
      };

      jest.spyOn(emailService, 'sendAccountDeletionEmail').mockResolvedValue();
      jest.spyOn(prisma.user, 'delete').mockResolvedValue(mockUser);

      const result = await service.remove(mockUserbyJWT);

      expect(result).toEqual({ ...mockUser, password: undefined });
      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
      expect(paymentService.cancelSubscription).not.toHaveBeenCalled();
      expect(emailService.sendAccountDeletionEmail).toHaveBeenCalledTimes(1);
      expect(prisma.user.delete).toHaveBeenCalledTimes(1);
    });
    it('should remove a user by ID with SUBSCRIPTION', async () => {
      const mockUserbyJWT: RequestUser = {
        id: 'user-id',
        name: 'John Doe',
        email: 'test@example.com',
        hasSubscription: true,
      };
      const mockUser: User = {
        id: 'user-id',
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password123',
        createdAt: new Date(),
        resetToken: null,
        resetTokenExpiration: null,
        subscriptionId: 'id',
        birthdate: '1990-01-01',
        city: 'Test City',
        occupation: 'Developer',
      };

      jest.spyOn(paymentService, 'cancelSubscription').mockResolvedValue({
        name: 'John',
        email: 'testJohn@email.com',
        subscriptionStatus: 'canceled',
      });
      jest.spyOn(emailService, 'sendAccountDeletionEmail').mockResolvedValue();
      jest.spyOn(prisma.user, 'delete').mockResolvedValue(mockUser);

      const result = await service.remove(mockUserbyJWT);

      expect(result).toEqual({ ...mockUser, password: undefined });
      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
      expect(paymentService.cancelSubscription).toHaveBeenCalledWith(
        mockUser.email,
      );
      expect(paymentService.cancelSubscription).toHaveBeenCalledTimes(1);
      expect(prisma.user.delete).toHaveBeenCalledTimes(1);
      expect(emailService.sendAccountDeletionEmail).toHaveBeenCalledTimes(1);
    });
    it('should throw HttpException if user is not found in remove', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      const mockUserbyJWT: RequestUser = {
        id: 'non-existing-id',
        name: 'John Doe',
        email: 'test@example.com',
        hasSubscription: false,
      };
      await expect(service.remove(mockUserbyJWT)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('resetPassword', () => {
    it('should reset the user password', async () => {
      const mockUser: User = {
        id: 'user-id',
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password123',
        createdAt: new Date(),
        subscriptionId: null,
        birthdate: '1990-01-01',
        city: 'Test City',
        occupation: 'Developer',
        resetToken: 'valid-token',
        resetTokenExpiration: new Date(Date.now() + 3600000),
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(prisma.user, 'update').mockResolvedValue({
        resetToken: null,
        resetTokenExpiration: null,
        password: await bcrypt.hash(mockUser.password, 10),
        ...mockUser,
      });

      const result = await service.resetPassword('valid-token', 'newPassword');

      expect(result).toEqual({
        password: undefined,
        resetToken: null,
        resetTokenExpiration: null,
        ...mockUser,
      });
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: {
          resetToken: null,
          resetTokenExpiration: null,
          password: await bcrypt.hash(mockUser.password, 10),
        },
      });
    });
    it('should throw HttpException if token is invalid or expired', async () => {
      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(null);

      await expect(
        service.resetPassword('invalid-token', 'newPassword'),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('sendResetPasswordEmail', () => {
    it('should send a reset password email', async () => {
      const mockUser: User = {
        id: 'user-id',
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password123',
        createdAt: new Date(),
        resetToken: null,
        resetTokenExpiration: null,
        subscriptionId: null,
        birthdate: '1990-01-01',
        city: 'Test City',
        occupation: 'Developer',
      };

      const mockResetToken = randomBytes(32).toString('hex');
      const mockResetTokenExpiration = new Date();
      mockResetTokenExpiration.setHours(
        mockResetTokenExpiration.getHours() + 1,
      );

      jest.spyOn(service, 'findByEmail').mockResolvedValue(mockUser);
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prisma.user, 'update').mockResolvedValue({
        ...mockUser,
        resetToken: mockResetToken,
        resetTokenExpiration: mockResetTokenExpiration,
      });
      jest.spyOn(emailService, 'sendResetPasswordEmail').mockResolvedValue();

      const result = await service.sendResetPasswordEmail(mockUser.email);
      expect(result).toBeUndefined();

      expect(service.findByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { email: mockUser.email },
        data: {
          resetToken: mockResetToken,
          resetTokenExpiration: expect.any(Date),
        },
      });
      expect(emailService.sendResetPasswordEmail).toHaveBeenCalledWith(
        { email: mockUser.email, name: mockUser.name },
        `https://localhost:3000/user/reset-password?token=${mockResetToken}`,
      );

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { resetToken: mockResetToken },
      });
      expect(prisma.user.update).toHaveBeenCalledTimes(1);
      expect(emailService.sendResetPasswordEmail).toHaveBeenCalledTimes(1);
    });

    it('should throw HttpException if user is not found with email', async () => {
      jest.spyOn(service, 'findByEmail').mockResolvedValue(null);

      await expect(
        service.sendResetPasswordEmail('non-existing-email'),
      ).rejects.toThrow(HttpException);
    });
  });

  // describe('cancelSubscription', () => {
  //   it('should handle subscription cancellation with A SUBSCRIPTION', async () => {
  //     const mockUser: User = {
  //       id: 'user-id',
  //       name: 'John Doe',
  //       email: 'test@example.com',
  //       password: 'password123',
  //       createdAt: new Date(),
  //       resetToken: null,
  //       resetTokenExpiration: null,
  //       subscriptionId: '1',
  //       birthdate: '1990-01-01',
  //       city: 'Test City',
  //       occupation: 'Developer',
  //     };

  //     const updatedUser: User = {
  //       ...mockUser,
  //       subscriptionId: null,
  //     };

  //     jest.spyOn(service, 'findById').mockResolvedValue(mockUser);
  //     jest.spyOn(prisma.user, 'update').mockResolvedValue(updatedUser);
  //     jest.spyOn(paymentService, 'cancelSubscription').mockResolvedValue({
  //       status: 'canceled',
  //     } as Stripe.Subscription);

  //     const result = await service.cancelSubscription(mockUser.id);

  //     expect(result).toEqual(updatedUser);
  //     expect(paymentService.cancelSubscription).toHaveBeenCalledWith(
  //       mockUser.subscriptionId,
  //     );
  //     expect(paymentService.cancelSubscription).toHaveBeenCalledTimes(1);
  //     expect(prisma.user.update).toHaveBeenCalledWith({
  //       where: { id: mockUser.id },
  //       data: { subscriptionId: null },
  //     });
  //   });

  //   it('should throw an error if subscription update fails', async () => {
  //     const mockUser: User = {
  //       id: 'user-id',
  //       name: 'John Doe',
  //       email: 'test@example.com',
  //       password: 'password123',
  //       createdAt: new Date(),
  //       resetToken: null,
  //       resetTokenExpiration: null,
  //       subscriptionId: 'sub_123',
  //       birthdate: '1990-01-01',
  //       city: 'Test City',
  //       occupation: 'Developer',
  //     };

  //     jest.spyOn(service, 'findById').mockResolvedValue(mockUser);
  //     jest
  //       .spyOn(prisma.user, 'update')
  //       .mockResolvedValue({ ...mockUser, subscriptionId: 'sub_123' });
  //     // Simulate failed update

  //     await expect(service.cancelSubscription('user-id')).rejects.toThrow(
  //       new Error(
  //         ERROR_MESSAGES.SUBSCRIPTION_UPDATE_FAILED_IN_CANCEL_SUBSCRIPTION,
  //       ),
  //     );

  //     expect(service.findById).toHaveBeenCalledWith(mockUser.id);
  //     expect(prisma.user.update).toHaveBeenCalledWith({
  //       where: { id: mockUser.id },
  //       data: { subscriptionId: null },
  //     });
  //     expect(prisma.user.update).toHaveBeenCalledTimes(1);
  //   });
  //   it('should handle subscription cancellation WITHOUT A SUBSCRIPTION', async () => {
  //     const mockUser: User = {
  //       id: 'user-id',
  //       name: 'John Doe',
  //       email: 'test@example.com',
  //       password: 'password123',
  //       createdAt: new Date(),
  //       resetToken: null,
  //       resetTokenExpiration: null,
  //       birthdate: '1990-01-01',
  //       city: 'Test City',
  //       occupation: 'Developer',
  //       subscriptionId: null,
  //     };

  //     jest.spyOn(service, 'findById').mockResolvedValue(mockUser);

  //     await expect(service.cancelSubscription(mockUser.id)).rejects.toThrow(
  //       HttpException,
  //     );
  //   });
  // });

  // describe('refundSubscription', () => {
  //   it('should handle subscription refund', async () => {
  //     const mockUser: User = {
  //       id: 'user-id',
  //       name: 'John Doe',
  //       email: 'test@example.com',
  //       password: 'password123',
  //       createdAt: new Date(),
  //       resetToken: null,
  //       resetTokenExpiration: null,
  //       subscriptionId: '1',
  //       birthdate: '1990-01-01',
  //       city: 'Test City',
  //       occupation: 'Developer',
  //     };
  //     const updatedUser: User = {
  //       ...mockUser,
  //       subscriptionId: null,
  //     };

  //     jest.spyOn(service, 'findById').mockResolvedValue(mockUser);
  //     jest
  //       .spyOn(paymentService, 'refundLastPaymentIfEligible')
  //       .mockResolvedValue({
  //         status: 'succeeded',
  //       } as Stripe.Refund);
  //     jest.spyOn(prisma.user, 'update').mockResolvedValue(updatedUser);

  //     const result = await service.refundSubscription(mockUser.id);

  //     expect(result).toEqual({ ...updatedUser, password: undefined });
  //     expect(service.findById).toHaveBeenCalledWith(mockUser.id);
  //     expect(paymentService.refundLastPaymentIfEligible).toHaveBeenCalledWith(
  //       mockUser.subscriptionId,
  //     );
  //     expect(prisma.user.update).toHaveBeenCalledWith({
  //       where: { id: mockUser.id },
  //       data: { subscriptionId: null },
  //     });
  //   });
  //   it('should throw an error if the refund is not eligible or fails', async () => {
  //     const mockUser: User = {
  //       id: 'user-id',
  //       name: 'John Doe',
  //       email: 'test@example.com',
  //       password: 'password123',
  //       createdAt: new Date(),
  //       resetToken: null,
  //       resetTokenExpiration: null,
  //       subscriptionId: null,
  //       birthdate: '1990-01-01',
  //       city: 'Test City',
  //       occupation: 'Developer',
  //     };

  //     jest.spyOn(service, 'findById').mockResolvedValue(mockUser);

  //     await expect(service.refundSubscription(mockUser.id)).rejects.toThrow(
  //       new HttpException(
  //         ERROR_MESSAGES.NO_ACTIVE_SUBSCRIPTION,
  //         HttpStatus.BAD_REQUEST,
  //       ),
  //     );

  //     expect(service.findById).toHaveBeenCalledWith(mockUser.id);
  //     expect(service.findById).toHaveBeenCalledTimes(1);
  //     expect(paymentService.refundLastPaymentIfEligible).not.toHaveBeenCalled();
  //     expect(prisma.user.update).not.toHaveBeenCalled();
  //   });
  //   it('should throw an error if the user update fails', async () => {
  //     const mockUser: User = {
  //       id: 'user-id',
  //       name: 'John Doe',
  //       email: 'test@example.com',
  //       password: 'password123',
  //       createdAt: new Date(),
  //       resetToken: null,
  //       resetTokenExpiration: null,
  //       subscriptionId: 'sub_123',
  //       birthdate: '1990-01-01',
  //       city: 'Test City',
  //       occupation: 'Developer',
  //     };

  //     jest.spyOn(service, 'findById').mockResolvedValue(mockUser);
  //     jest
  //       .spyOn(paymentService, 'refundLastPaymentIfEligible')
  //       .mockResolvedValue({ status: 'succeeded' } as Stripe.Refund);
  //     jest.spyOn(prisma.user, 'update').mockResolvedValue({
  //       ...mockUser,
  //       subscriptionId: 'sub_123', // Simulate failed update
  //     });

  //     await expect(service.refundSubscription(mockUser.id)).rejects.toThrow(
  //       new Error(ERROR_MESSAGES.SUBSCRIPTION_UPDATE_FAILED_IN_REFUND),
  //     );

  //     expect(service.findById).toHaveBeenCalledWith(mockUser.id);
  //     expect(paymentService.refundLastPaymentIfEligible).toHaveBeenCalledWith(
  //       mockUser.subscriptionId,
  //     );
  //     expect(prisma.user.update).toHaveBeenCalledWith({
  //       where: { id: mockUser.id },
  //       data: { subscriptionId: null },
  //     });
  //     expect(service.findById).toHaveBeenCalledTimes(1);
  //     expect(paymentService.refundLastPaymentIfEligible).toHaveBeenCalledTimes(
  //       1,
  //     );
  //     expect(prisma.user.update).toHaveBeenCalledTimes(1);
  //   });
  //   it('should throw an error if the user is not found', async () => {
  //     jest.spyOn(service, 'findById').mockResolvedValue(null);

  //     await expect(service.refundSubscription('user-id')).rejects.toThrow(
  //       HttpException,
  //     );

  //     expect(service.findById).toHaveBeenCalledWith('user-id');
  //     expect(paymentService.refundLastPaymentIfEligible).not.toHaveBeenCalled();
  //     expect(prisma.user.update).not.toHaveBeenCalled();
  //   });
  // });

  // describe('makeSubscription', () => {
  //   it('should handle subscription purchase', async () => {
  //     const mockUser: User = {
  //       id: 'user-id',
  //       name: 'John Doe',
  //       email: 'test@example.com',
  //       password: 'password123',
  //       createdAt: new Date(),
  //       resetToken: null,
  //       resetTokenExpiration: null,
  //       subscriptionId: null,
  //       birthdate: '1990-01-01',
  //       city: 'Test City',
  //       occupation: 'Developer',
  //     };
  //     const updatedUser: User = {
  //       ...mockUser,
  //       subscriptionId: 'mocked-session-id',
  //     };

  //     jest.spyOn(service, 'findById').mockResolvedValue(mockUser); //1st error
  //     jest.spyOn(paymentService, 'createCheckoutSession').mockResolvedValue({
  //       id: 'mocked-session-id',
  //       url: 'https://example.com/checkout',
  //       status: 'complete',
  //     } as Stripe.Checkout.Session); //2nd error
  //     jest.spyOn(prisma.user, 'update').mockResolvedValue(updatedUser); //3rd error

  //     const result = await service.makeSubscription(mockUser.id);

  //     expect(result).toEqual({ ...updatedUser, password: undefined });
  //     expect(service.findById).toHaveBeenCalledWith(mockUser.id);
  //     expect(paymentService.createCheckoutSession).toHaveBeenCalledWith({
  //       email: mockUser.email,
  //       isSubscription: true,
  //     });
  //     expect(prisma.user.update).toHaveBeenCalledWith({
  //       where: { id: mockUser.id },
  //       data: { subscriptionId: updatedUser.subscriptionId },
  //     });
  //   });

  //   it('should throw an error if the user already has a subscription', async () => {
  //     const mockUser: User = {
  //       id: 'user-id',
  //       name: 'John Doe',
  //       email: 'test@example.com',
  //       password: 'password123',
  //       createdAt: new Date(),
  //       resetToken: null,
  //       resetTokenExpiration: null,
  //       subscriptionId: '1',
  //       birthdate: '1990-01-01',
  //       city: 'Test City',
  //       occupation: 'Developer',
  //     };

  //     jest.spyOn(service, 'findById').mockResolvedValue(mockUser); //1st error

  //     await expect(service.makeSubscription(mockUser.id)).rejects.toThrow(
  //       new Error(ERROR_MESSAGES.USER_ALREADY_HAS_A_SUBSCRIPTION),
  //     );
  //     expect(service.findById).toHaveBeenCalledWith(mockUser.id);
  //     expect(paymentService.createCheckoutSession).not.toHaveBeenCalled();
  //     expect(prisma.user.update).not.toHaveBeenCalled();
  //   });

  //   it('should throw an error if the create checkout season failded', async () => {
  //     const mockUser: User = {
  //       id: 'user-id',
  //       name: 'John Doe',
  //       email: 'test@example.com',
  //       password: 'password123',
  //       createdAt: new Date(),
  //       resetToken: null,
  //       resetTokenExpiration: null,
  //       subscriptionId: null,
  //       birthdate: '1990-01-01',
  //       city: 'Test City',
  //       occupation: 'Developer',
  //     };

  //     jest.spyOn(service, 'findById').mockResolvedValue(mockUser);
  //     jest.spyOn(paymentService, 'createCheckoutSession').mockResolvedValue({
  //       id: 'mocked-session-id',
  //       url: 'https://example.com/checkout',
  //       status: 'expired',
  //     } as Stripe.Checkout.Session); //2nd error

  //     await expect(service.makeSubscription(mockUser.id)).rejects.toThrow(
  //       new Error(STRIPE_ERRORS.CHECKOUT_NOT_COMPLETED),
  //     );
  //     expect(service.findById).toHaveBeenCalledWith(mockUser.id);
  //     expect(paymentService.createCheckoutSession).toHaveBeenCalledWith({
  //       email: mockUser.email,
  //       isSubscription: true,
  //     });
  //     expect(prisma.user.update).not.toHaveBeenCalled();
  //   });

  //   it('should throw an error if the user update fails', async () => {
  //     const mockUser: User = {
  //       id: 'user-id',
  //       name: 'John Doe',
  //       email: 'test@example.com',
  //       password: 'password123',
  //       createdAt: new Date(),
  //       resetToken: null,
  //       resetTokenExpiration: null,
  //       subscriptionId: null,
  //       birthdate: '1990-01-01',
  //       city: 'Test City',
  //       occupation: 'Developer',
  //     };

  //     jest.spyOn(service, 'findById').mockResolvedValue(mockUser);
  //     jest.spyOn(paymentService, 'createCheckoutSession').mockResolvedValue({
  //       id: 'someId',
  //       url: 'https://example.com/checkout',
  //       status: 'complete',
  //     } as Stripe.Checkout.Session); //2nd error

  //     jest.spyOn(prisma.user, 'update').mockResolvedValue({
  //       ...mockUser,
  //       subscriptionId: null, // Simulate failed update
  //     });

  //     await expect(service.makeSubscription(mockUser.id)).rejects.toThrow(
  //       new Error(
  //         ERROR_MESSAGES.SUBSCRIPTION_UPDATE_FAILED_IN_SUBSCRIPTION_PURCHASE,
  //       ),
  //     );

  //     expect(service.findById).toHaveBeenCalledWith(mockUser.id);
  //     expect(paymentService.createCheckoutSession).toHaveBeenCalledWith({
  //       email: mockUser.email,
  //       isSubscription: true,
  //     });
  //     expect(prisma.user.update).toHaveBeenCalledWith({
  //       where: { id: mockUser.id },
  //       data: { subscriptionId: 'someId' },
  //     });
  //     expect(service.findById).toHaveBeenCalledTimes(1);
  //     expect(paymentService.createCheckoutSession).toHaveBeenCalledTimes(1);
  //     expect(prisma.user.update).toHaveBeenCalledTimes(1);
  //   });
  // });
});
