import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ClassroomService } from '../classroom.service';
import { CLASSROOM_REPOSITORY_TOKEN } from '../../repositories/abstract/classroom.repository';
import { PROFESSOR_STATS_SERVICE_TOKEN } from '../../Stats/abstract-services/abstract-professor-stats.service';
import { CreateClassroomDto } from '../dto/classroom.create.dto';
import { UpdateClassroomDto } from '../dto/classroom.update.dto';
import { Classroom } from '@prisma/client';
import * as crypto from 'crypto';

describe('ClassroomService', () => {
  let service: ClassroomService;
  let mockClassroomRepository: any;
  let mockProfessorStatsService: any;

  const mockClassroom: Classroom = {
    code: 'abc123def',
    name: 'Test Classroom',
    invite_expiration: new Date('2024-12-31'),
    created_by: 'user-123',
    created_at: new Date(),
  };

  const mockCreateDto: CreateClassroomDto = {
    name: 'New Classroom',
    invite_expiration: new Date('2024-12-31'),
  };

  const mockUpdateDto: UpdateClassroomDto = {
    name: 'Updated Classroom',
  };

  beforeEach(async () => {
    mockClassroomRepository = {
      findOneByMarathonId: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      findByCode: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    mockProfessorStatsService = {
      incrementClassesProfessorStats: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClassroomService,
        {
          provide: CLASSROOM_REPOSITORY_TOKEN,
          useValue: mockClassroomRepository,
        },
        {
          provide: PROFESSOR_STATS_SERVICE_TOKEN,
          useValue: mockProfessorStatsService,
        },
      ],
    }).compile();

    service = module.get<ClassroomService>(ClassroomService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneByMarathonId', () => {
    it('should return a classroom when found', async () => {
      const marathonId = 'marathon-123';
      mockClassroomRepository.findOneByMarathonId.mockResolvedValue(
        mockClassroom,
      );

      const result = await service.findOneByMarathonId(marathonId);

      expect(mockClassroomRepository.findOneByMarathonId).toHaveBeenCalledWith(
        marathonId,
      );
      expect(result).toEqual(mockClassroom);
    });

    it('should throw NotFoundException when classroom not found', async () => {
      const marathonId = 'marathon-123';
      mockClassroomRepository.findOneByMarathonId.mockResolvedValue(null);

      await expect(service.findOneByMarathonId(marathonId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockClassroomRepository.findOneByMarathonId).toHaveBeenCalledWith(
        marathonId,
      );
    });
  });

  describe('findAllByUserId', () => {
    it('should return all classrooms when found', async () => {
      const userId = 'user-123';
      const classrooms = [mockClassroom];
      mockClassroomRepository.findAll.mockResolvedValue(classrooms);

      const result = await service.findAllByUserId(userId);

      expect(mockClassroomRepository.findAll).toHaveBeenCalledWith(userId);
      expect(result).toEqual(classrooms);
    });

    it('should throw NotFoundException when no classrooms found', async () => {
      const userId = 'user-123';
      mockClassroomRepository.findAll.mockResolvedValue(null);

      await expect(service.findAllByUserId(userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockClassroomRepository.findAll).toHaveBeenCalledWith(userId);
    });
  });

  describe('create', () => {
    it('should create a classroom and increment professor stats', async () => {
      const userId = 'user-123';
      const generatedCode = 'generated123';

      // Mock the crypto.randomBytes to return a predictable value
      jest.spyOn(crypto, 'randomBytes').mockReturnValue({
        toString: () => generatedCode,
      } as any);

      mockClassroomRepository.create.mockResolvedValue(mockClassroom);
      mockProfessorStatsService.incrementClassesProfessorStats.mockResolvedValue(
        undefined,
      );

      const result = await service.create(mockCreateDto, userId);

      expect(
        mockProfessorStatsService.incrementClassesProfessorStats,
      ).toHaveBeenCalledWith(userId);
      expect(mockClassroomRepository.create).toHaveBeenCalledWith(
        mockCreateDto,
        generatedCode,
        userId,
      );
      expect(result).toEqual(mockClassroom);
    });
  });

  describe('findOne', () => {
    it('should return a classroom when found by code', async () => {
      const code = 'abc123def';
      mockClassroomRepository.findByCode.mockResolvedValue(mockClassroom);

      const result = await service.findOne(code);

      expect(mockClassroomRepository.findByCode).toHaveBeenCalledWith(code);
      expect(result).toEqual(mockClassroom);
    });

    it('should throw NotFoundException when classroom not found by code', async () => {
      const code = 'abc123def';
      mockClassroomRepository.findByCode.mockResolvedValue(null);

      await expect(service.findOne(code)).rejects.toThrow(NotFoundException);
      expect(mockClassroomRepository.findByCode).toHaveBeenCalledWith(code);
    });
  });

  describe('update', () => {
    it('should update a classroom when found', async () => {
      const code = 'abc123def';
      const updatedClassroom = { ...mockClassroom, ...mockUpdateDto };

      mockClassroomRepository.findByCode.mockResolvedValue(mockClassroom);
      mockClassroomRepository.update.mockResolvedValue(updatedClassroom);

      const result = await service.update(code, mockUpdateDto);

      expect(mockClassroomRepository.findByCode).toHaveBeenCalledWith(code);
      expect(mockClassroomRepository.update).toHaveBeenCalledWith(
        code,
        mockUpdateDto,
      );
      expect(result).toEqual(updatedClassroom);
    });

    it('should throw NotFoundException when classroom not found for update', async () => {
      const code = 'abc123def';
      mockClassroomRepository.findByCode.mockResolvedValue(null);

      await expect(service.update(code, mockUpdateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockClassroomRepository.findByCode).toHaveBeenCalledWith(code);
      expect(mockClassroomRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a classroom when found', async () => {
      const code = 'abc123def';
      mockClassroomRepository.findByCode.mockResolvedValue(mockClassroom);
      mockClassroomRepository.remove.mockResolvedValue(undefined);

      await service.remove(code);

      expect(mockClassroomRepository.findByCode).toHaveBeenCalledWith(code);
      expect(mockClassroomRepository.remove).toHaveBeenCalledWith(code);
    });

    it('should throw NotFoundException when classroom not found for removal', async () => {
      const code = 'abc123def';
      mockClassroomRepository.findByCode.mockResolvedValue(null);

      await expect(service.remove(code)).rejects.toThrow(NotFoundException);
      expect(mockClassroomRepository.findByCode).toHaveBeenCalledWith(code);
      expect(mockClassroomRepository.remove).not.toHaveBeenCalled();
    });
  });
});
