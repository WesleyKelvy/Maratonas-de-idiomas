import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { AuthController } from '../../auth/auth.controller';
import { AuthRequest } from '../../auth/models/AuthRequest';
import { UserToken } from '../../auth/models/UserToken';
import { PaymentService } from '../../payment/payment.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ERROR_MESSAGES } from '../error/user-service.error';
import { UserController } from '../user.controller';

describe('User Payment Integration (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let user: User;
  let jwtToken: UserToken;
  let userController: UserController;
  let authController: AuthController;
  let mockedSubsId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PaymentService)
      .useValue({
        createCheckoutSession: jest.fn().mockResolvedValue({
          url: 'https://www.fake_subscription_id.com',
        }),
        cancelSubscription: jest.fn().mockResolvedValue({ status: 'canceled' }),
        refundLastPaymentIfEligible: jest
          .fn()
          .mockResolvedValue({ status: 'succeeded' }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    authController = moduleFixture.get<AuthController>(AuthController);
    userController = moduleFixture.get<UserController>(UserController);

    mockedSubsId = 'fake_subscription_id';
  });

  beforeEach(async () => {
    // First User: no subs.
    const dataUserOne = {
      subscriptionId: null,
      email: 'testrefund@example.com',
      name: 'Refund User',
      password: 'Hashedpassword123!',
      birthdate: '12/12/2024',
      city: 'Crato',
      occupation: 'dev',
    };

    // First User:
    user = (await userController.create(dataUserOne)).data;
    user.password = dataUserOne.password;
    jwtToken = await authController.login({ user } as AuthRequest);
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await app.close();
  });

  // Auth test integration
  // it('should return 200 for a valid token', async () => {
  //   const response = await request(app.getHttpServer())
  //     .get(`/user/${user.id}`)
  //     .set('Authorization', `Bearer ${jwtToken.accessToken}`)
  //     .send();

  //   expect(response.status).toBe(200);
  // });
  describe('Make Subscription', () => {
    it('should create a user and subscribe them to a plan', async () => {
      const response = await request(app.getHttpServer())
        .post('/payment/create-checkout-session')
        .set('Authorization', `Bearer ${jwtToken.accessToken}`)
        .send();

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.url).toBe(
        'https://www.fake_subscription_id.com',
      );

      // // Verify database update
      // const updatedUser = await prisma.user.findUnique({
      //   where: { id: user.id },
      // });
      // expect(updatedUser?.subscriptionId).toBe('fake_subscription_id');
    });

    it('should get error with a user with subs. trying to subscribe again', async () => {
      user = await prisma.user.update({
        where: { email: user.email },
        data: { subscriptionId: mockedSubsId },
      });
      jwtToken = await authController.login({ user } as AuthRequest);

      const response = await request(app.getHttpServer())
        .post('/payment/create-checkout-session')
        .set('Authorization', `Bearer ${jwtToken.accessToken}`)
        .send();

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        ERROR_MESSAGES.USER_ALREADY_HAS_A_SUBSCRIPTION,
      );
    });
  });

  describe('Cancel Subscription', () => {
    it('should cancel the user subscription', async () => {
      user = await prisma.user.update({
        where: { email: user.email },
        data: { subscriptionId: mockedSubsId },
      });
      jwtToken = await authController.login({ user } as AuthRequest);

      const response = await request(app.getHttpServer())
        .post('/payment/cancel-subscription')
        .set('Authorization', `Bearer ${jwtToken.accessToken}`)
        .send();

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('canceled');
    });
    it('should get an error at cancel the user subscription', async () => {
      const response = await request(app.getHttpServer())
        .post('/payment/cancel-subscription')
        .set('Authorization', `Bearer ${jwtToken.accessToken}`)
        .send();

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('A valid subscription is required.');
    });
  });

  describe('Refund Subscription', () => {
    it('should refund a subscription payment', async () => {
      user = await prisma.user.update({
        where: { email: user.email },
        data: { subscriptionId: mockedSubsId },
      });
      jwtToken = await authController.login({ user } as AuthRequest);
      const response = await request(app.getHttpServer())
        .post('/payment/refund-subscription')
        .set('Authorization', `Bearer ${jwtToken.accessToken}`)
        .send();

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('succeeded');

      // // Verify database update
      // const updatedUser = await prisma.user.findUnique({
      //   where: { id: user.id },
      // });
      // expect(updatedUser?.subscriptionId).toBeNull();
    });
    it('should get an error refund a subscription payment', async () => {
      const response = await request(app.getHttpServer())
        .post('/payment/refund-subscription')
        .set('Authorization', `Bearer ${jwtToken.accessToken}`)
        .send();

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('A valid subscription is required.');
    });
  });
});
