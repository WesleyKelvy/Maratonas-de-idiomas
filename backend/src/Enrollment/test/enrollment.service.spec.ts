import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { EnrollmentService } from '../enrollment.service';
import { ENROLLMENT_REPOSITORY_TOKEN } from '../../repositories/abstract/enrollment.repository';
import { PROFESSOR_STATS_SERVICE_TOKEN } from '../../Stats/abstract-services/abstract-professor-stats.service';
import { CLASSROOM_SERVICE_TOKEN } from '../../Classroom/abstract-services/abstract-classrom.service';
import { Enrollment } from '@prisma/client';

describe('EnrollmentService', () => {
  let service: EnrollmentService;
  let mockEnrollmentRepository: any;
  let mockProfessorStatsService: any;
  let mockClassroomService: any;

  const mockEnrollment: Enrollment = {
    id: 'enrollment-123',
    marathon_id: 'marathon-456',
    user_id: 'user-123',
  };

  const mockClassroom = {
    code: 'classroom-abc',
    name: 'Test Classroom',
    created_by: 'professor-456',
    created_at: new Date(),
  };

  beforeEach(async () => {
    mockEnrollmentRepository = {
      findAllByUserId: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
    };

    mockProfessorStatsService = {
      incrementTotalStudentsProfessorStats: jest.fn(),
    };

    mockClassroomService = {
      findOneByMarathonId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentService,
        {
          provide: ENROLLMENT_REPOSITORY_TOKEN,
          useValue: mockEnrollmentRepository,
        },
        {
          provide: PROFESSOR_STATS_SERVICE_TOKEN,
          useValue: mockProfessorStatsService,
        },
        {
          provide: CLASSROOM_SERVICE_TOKEN,
          useValue: mockClassroomService,
        },
      ],
    }).compile();

    service = module.get<EnrollmentService>(EnrollmentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllByUserId', () => {
    it('should return all enrollments when found', async () => {
      const userId = 'user-123';
      const enrollments = [mockEnrollment];
      mockEnrollmentRepository.findAllByUserId.mockResolvedValue(enrollments);

      const result = await service.findAllByUserId(userId);

      expect(mockEnrollmentRepository.findAllByUserId).toHaveBeenCalledWith(
        userId,
      );
      expect(result).toEqual(enrollments);
    });

    it('should throw NotFoundException when no enrollments found', async () => {
      const userId = 'user-123';
      mockEnrollmentRepository.findAllByUserId.mockResolvedValue(null);

      await expect(service.findAllByUserId(userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockEnrollmentRepository.findAllByUserId).toHaveBeenCalledWith(
        userId,
      );
    });

    it('should throw NotFoundException with correct message', async () => {
      const userId = 'user-123';
      mockEnrollmentRepository.findAllByUserId.mockResolvedValue(null);

      await expect(service.findAllByUserId(userId)).rejects.toThrow(
        'Marathons for this classroom does not exist.',
      );
    });
  });

  describe('findOne', () => {
    it('should return an enrollment when found', async () => {
      const marathonId = 'marathon-456';
      const userId = 'user-123';
      mockEnrollmentRepository.findOne.mockResolvedValue(mockEnrollment);

      const result = await service.findOne(marathonId, userId);

      expect(mockEnrollmentRepository.findOne).toHaveBeenCalledWith(
        marathonId,
        userId,
      );
      expect(result).toEqual(mockEnrollment);
    });

    it('should return null when enrollment not found', async () => {
      const marathonId = 'marathon-456';
      const userId = 'user-123';
      mockEnrollmentRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(marathonId, userId);

      expect(mockEnrollmentRepository.findOne).toHaveBeenCalledWith(
        marathonId,
        userId,
      );
      expect(result).toBeNull();
    });

    it('should handle different marathon and user IDs', async () => {
      const marathonId = 'marathon-999';
      const userId = 'user-999';
      const expectedEnrollment = {
        ...mockEnrollment,
        marathon_id: marathonId,
        user_id: userId,
      };
      mockEnrollmentRepository.findOne.mockResolvedValue(expectedEnrollment);

      const result = await service.findOne(marathonId, userId);

      expect(mockEnrollmentRepository.findOne).toHaveBeenCalledWith(
        marathonId,
        userId,
      );
      expect(result).toEqual(expectedEnrollment);
    });
  });

  describe('create', () => {
    it('should create an enrollment successfully', async () => {
      const userId = 'user-123';
      const marathonId = 'marathon-456';

      mockEnrollmentRepository.findOne.mockResolvedValue(null);
      mockClassroomService.findOneByMarathonId.mockResolvedValue(mockClassroom);
      mockProfessorStatsService.incrementTotalStudentsProfessorStats.mockResolvedValue(
        undefined,
      );
      mockEnrollmentRepository.create.mockResolvedValue(mockEnrollment);

      const result = await service.create(userId, marathonId);

      expect(mockEnrollmentRepository.findOne).toHaveBeenCalledWith(
        marathonId,
        userId,
      );
      expect(mockClassroomService.findOneByMarathonId).toHaveBeenCalledWith(
        marathonId,
      );
      expect(
        mockProfessorStatsService.incrementTotalStudentsProfessorStats,
      ).toHaveBeenCalledWith(mockClassroom.created_by);
      expect(mockEnrollmentRepository.create).toHaveBeenCalledWith(
        userId,
        marathonId,
      );
      expect(result).toEqual(mockEnrollment);
    });

    it('should throw ConflictException when enrollment already exists', async () => {
      const userId = 'user-123';
      const marathonId = 'marathon-456';

      mockEnrollmentRepository.findOne.mockResolvedValue(mockEnrollment);

      await expect(service.create(userId, marathonId)).rejects.toThrow(
        ConflictException,
      );
      expect(mockEnrollmentRepository.findOne).toHaveBeenCalledWith(
        marathonId,
        userId,
      );
      expect(mockClassroomService.findOneByMarathonId).not.toHaveBeenCalled();
      expect(
        mockProfessorStatsService.incrementTotalStudentsProfessorStats,
      ).not.toHaveBeenCalled();
      expect(mockEnrollmentRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ConflictException with correct message', async () => {
      const userId = 'user-123';
      const marathonId = 'marathon-456';

      mockEnrollmentRepository.findOne.mockResolvedValue(mockEnrollment);

      await expect(service.create(userId, marathonId)).rejects.toThrow(
        'Enrollemt already done!',
      );
    });

    it('should handle classroom service errors', async () => {
      const userId = 'user-123';
      const marathonId = 'marathon-456';

      mockEnrollmentRepository.findOne.mockResolvedValue(null);
      mockClassroomService.findOneByMarathonId.mockRejectedValue(
        new NotFoundException('Classroom not found'),
      );

      await expect(service.create(userId, marathonId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockEnrollmentRepository.findOne).toHaveBeenCalledWith(
        marathonId,
        userId,
      );
      expect(mockClassroomService.findOneByMarathonId).toHaveBeenCalledWith(
        marathonId,
      );
      expect(
        mockProfessorStatsService.incrementTotalStudentsProfessorStats,
      ).not.toHaveBeenCalled();
      expect(mockEnrollmentRepository.create).not.toHaveBeenCalled();
    });

    it('should create enrollment with different user and marathon IDs', async () => {
      const userId = 'user-999';
      const marathonId = 'marathon-999';
      const expectedEnrollment = {
        ...mockEnrollment,
        user_id: userId,
        marathon_id: marathonId,
      };

      mockEnrollmentRepository.findOne.mockResolvedValue(null);
      mockClassroomService.findOneByMarathonId.mockResolvedValue(mockClassroom);
      mockProfessorStatsService.incrementTotalStudentsProfessorStats.mockResolvedValue(
        undefined,
      );
      mockEnrollmentRepository.create.mockResolvedValue(expectedEnrollment);

      const result = await service.create(userId, marathonId);

      expect(mockEnrollmentRepository.findOne).toHaveBeenCalledWith(
        marathonId,
        userId,
      );
      expect(mockClassroomService.findOneByMarathonId).toHaveBeenCalledWith(
        marathonId,
      );
      expect(
        mockProfessorStatsService.incrementTotalStudentsProfessorStats,
      ).toHaveBeenCalledWith(mockClassroom.created_by);
      expect(mockEnrollmentRepository.create).toHaveBeenCalledWith(
        userId,
        marathonId,
      );
      expect(result).toEqual(expectedEnrollment);
    });

    it('should handle professor stats service errors gracefully', async () => {
      const userId = 'user-123';
      const marathonId = 'marathon-456';

      mockEnrollmentRepository.findOne.mockResolvedValue(null);
      mockClassroomService.findOneByMarathonId.mockResolvedValue(mockClassroom);
      mockProfessorStatsService.incrementTotalStudentsProfessorStats.mockRejectedValue(
        new Error('Stats service error'),
      );

      await expect(service.create(userId, marathonId)).rejects.toThrow(
        'Stats service error',
      );
      expect(mockEnrollmentRepository.findOne).toHaveBeenCalledWith(
        marathonId,
        userId,
      );
      expect(mockClassroomService.findOneByMarathonId).toHaveBeenCalledWith(
        marathonId,
      );
      expect(
        mockProfessorStatsService.incrementTotalStudentsProfessorStats,
      ).toHaveBeenCalledWith(mockClassroom.created_by);
      expect(mockEnrollmentRepository.create).not.toHaveBeenCalled();
    });
  });
});
