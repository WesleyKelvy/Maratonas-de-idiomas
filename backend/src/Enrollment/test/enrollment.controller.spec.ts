import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentController } from '../enrollment.controller';
import { ENROLLMENT_SERVICE_TOKEN } from '../abstract-services/abstract-enrollment.service';
import { UserFromJwt } from '../../auth/models/UserFromJwt';
import { Enrollment } from '@prisma/client';

describe('EnrollmentController', () => {
  let controller: EnrollmentController;
  let mockEnrollmentService: any;

  const mockEnrollmentService_obj = {
    create: jest.fn(),
    findAllByUserId: jest.fn(),
  };

  const mockUser: UserFromJwt = {
    id: 'user-123',
    email: 'student@example.com',
    name: 'Student Name',
    role: 'Student',
  };

  const mockEnrollment: Enrollment = {
    id: 'enrollment-123',
    marathon_id: 'marathon-456',
    user_id: 'user-123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrollmentController],
      providers: [
        {
          provide: ENROLLMENT_SERVICE_TOKEN,
          useValue: mockEnrollmentService_obj,
        },
      ],
    }).compile();

    controller = module.get<EnrollmentController>(EnrollmentController);
    mockEnrollmentService = module.get(ENROLLMENT_SERVICE_TOKEN);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an enrollment', async () => {
      const marathonId = 'marathon-456';
      mockEnrollmentService.create.mockResolvedValue(mockEnrollment);

      const result = await controller.create(mockUser, marathonId);

      expect(mockEnrollmentService.create).toHaveBeenCalledWith(
        marathonId,
        mockUser.id,
      );
      expect(result).toEqual(mockEnrollment);
    });

    it('should handle enrollment creation with different marathon ID', async () => {
      const marathonId = 'marathon-789';
      const expectedEnrollment = {
        ...mockEnrollment,
        marathon_id: marathonId,
      };
      mockEnrollmentService.create.mockResolvedValue(expectedEnrollment);

      const result = await controller.create(mockUser, marathonId);

      expect(mockEnrollmentService.create).toHaveBeenCalledWith(
        marathonId,
        mockUser.id,
      );
      expect(result).toEqual(expectedEnrollment);
    });
  });

  describe('findAllByUserId', () => {
    it('should return all enrollments for a marathon', async () => {
      const marathonId = 'marathon-456';
      const enrollments = [mockEnrollment];
      mockEnrollmentService.findAllByUserId.mockResolvedValue(enrollments);

      const result = await controller.findAllByUserId(marathonId);

      expect(mockEnrollmentService.findAllByUserId).toHaveBeenCalledWith(
        marathonId,
      );
      expect(result).toEqual(enrollments);
    });

    it('should return empty array when no enrollments found', async () => {
      const marathonId = 'marathon-456';
      const enrollments: Enrollment[] = [];
      mockEnrollmentService.findAllByUserId.mockResolvedValue(enrollments);

      const result = await controller.findAllByUserId(marathonId);

      expect(mockEnrollmentService.findAllByUserId).toHaveBeenCalledWith(
        marathonId,
      );
      expect(result).toEqual(enrollments);
    });

    it('should handle different marathon IDs', async () => {
      const marathonId = 'marathon-999';
      const enrollments = [{ ...mockEnrollment, marathon_id: marathonId }];
      mockEnrollmentService.findAllByUserId.mockResolvedValue(enrollments);

      const result = await controller.findAllByUserId(marathonId);

      expect(mockEnrollmentService.findAllByUserId).toHaveBeenCalledWith(
        marathonId,
      );
      expect(result).toEqual(enrollments);
    });
  });
});
