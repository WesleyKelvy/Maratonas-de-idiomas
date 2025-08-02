import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { MESSAGES } from '../constants/user-controller-messages.message';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { UserFromJwt } from '../../auth/models/UserFromJwt';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            sendResetPasswordEmail: jest.fn(),
            resetPassword: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user and return success response', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        birthdate: '2000-01-01',
        city: 'City A',
        occupation: 'Developer',
      };

      const mockResponse: User = {
        id: 'user-id',
        subscriptionId: null,
        ...createUserDto,
        createdAt: new Date(),
        resetToken: null,
        resetTokenExpiration: null,
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockResponse);

      const result = await controller.create(createUserDto);
      result.data.password = undefined;

      expect(result).toEqual({
        success: true,
        data: { ...mockResponse },
        message: MESSAGES.USER_CREATED,
      });
      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should retrieve a user by ID and return success response', async () => {
      const mockUserId = 'user-id';

      const mockUser: User = {
        id: mockUserId,
        subscriptionId: null,
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        birthdate: '2000-01-01',
        city: 'City A',
        occupation: 'Developer',
        createdAt: new Date(),
        resetToken: null,
        resetTokenExpiration: null,
      };

      jest.spyOn(service, 'findById').mockResolvedValue(mockUser);

      const result = await controller.findOne(mockUserId);
      result.data.password = undefined;

      expect(result).toEqual({
        success: true,
        data: { ...mockUser },
        message: MESSAGES.USER_RETRIEVED,
      });
      expect(service.findById).toHaveBeenCalledWith(mockUserId);
      expect(service.findById).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update a user by ID and return success response', async () => {
      const user: UserFromJwt = {
        id: 'user-id',
        email: 'test@example.com',
        name: 'User',
        hasSubscription: false,
      };

      const updateUserDto: UpdateUserDto = {
        name: 'Updated User',
        city: 'Updated City',
        occupation: 'Updated Occupation',
      };

      const mockResponse: User = {
        id: user.id,
        name: updateUserDto.name || 'Default name',
        occupation: updateUserDto.occupation || 'Veterinary',
        city: updateUserDto.name || 'Boston',
        email: 'test@example.com',
        password: 'password123',
        birthdate: '2000-01-01',
        createdAt: new Date(),
        subscriptionId: null,
        resetToken: null,
        resetTokenExpiration: null,
      };

      jest.spyOn(service, 'update').mockResolvedValue(mockResponse);

      const result = await controller.update(user, updateUserDto);
      result.data.password = undefined;

      expect(result).toEqual({
        success: true,
        data: { ...mockResponse },
        message: MESSAGES.USER_UPDATED,
      });
      expect(service.update).toHaveBeenCalledWith(user.id, updateUserDto);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should remove a user by ID and return success response', async () => {
      const user: UserFromJwt = {
        id: 'user-id',
        email: 'test@example.com',
        name: 'User',
        hasSubscription: false,
      };

      const mockResponse: User = {
        id: user.id,
        name: 'Default name',
        occupation: 'Veterinary',
        city: 'Boston',
        email: 'test@example.com',
        password: 'password123',
        birthdate: '2000-01-01',
        createdAt: new Date(),
        subscriptionId: null,
        resetToken: null,
        resetTokenExpiration: null,
      };

      jest.spyOn(service, 'remove').mockResolvedValue(mockResponse);

      const result = await controller.remove(user);
      result.data.password = undefined;

      expect(result).toEqual({
        success: true,
        data: mockResponse,
        message: MESSAGES.USER_DELETED,
      });
      expect(service.remove).toHaveBeenCalledWith(user);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });

  describe('requestPasswordReset', () => {
    it('should send a password reset email', async () => {
      const email = 'test@example.com';

      jest.spyOn(service, 'sendResetPasswordEmail').mockResolvedValue();

      const result = await controller.requestPasswordReset(email);

      expect(result).toEqual({ message: 'Password reset email sent.' });
      expect(service.sendResetPasswordEmail).toHaveBeenCalledWith(email);
      expect(service.sendResetPasswordEmail).toHaveBeenCalledTimes(1);
    });
  });

  describe('resetPassword', () => {
    it('should reset the user password and return success response', async () => {
      const token = 'reset-token';

      const newPassword = 'newPassword123';

      const updatedUser: User = {
        id: 'user-id',
        name: 'Test User',
        email: 'test@example.com',
        password: newPassword,
        birthdate: '2000-01-01',
        city: 'City A',
        occupation: 'Developer',
        createdAt: new Date(),
        subscriptionId: null,
        resetToken: null,
        resetTokenExpiration: null,
      };

      jest.spyOn(service, 'resetPassword').mockResolvedValue(updatedUser);

      const result = await controller.resetPassword(token, newPassword);
      result.data.password = undefined;

      expect(result).toEqual({
        success: true,
        data: { ...updatedUser },
        message: MESSAGES.PASSWORD_CHANGED,
      });
      expect(service.resetPassword).toHaveBeenCalledWith(token, newPassword);
      expect(service.resetPassword).toHaveBeenCalledTimes(1);
    });
  });
});
