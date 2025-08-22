import { Test, TestingModule } from '@nestjs/testing';
import { ClassroomController } from '../classroom.controller';
import { ClassroomService } from '../classroom.service';
import { CLASSROOM_SERVICE_TOKEN } from '../abstract-services/abstract-classrom.service';
import { CreateClassroomDto } from '../dto/classroom.create.dto';
import { UpdateClassroomDto } from '../dto/classroom.update.dto';
import { UserFromJwt } from '../../auth/models/UserFromJwt';
import { Classroom } from '@prisma/client';

describe('ClassroomController', () => {
  let controller: ClassroomController;
  let service: ClassroomService;

  const mockClassroomService = {
    create: jest.fn(),
    findAllByUserId: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser: UserFromJwt = {
    id: 'user-123',
    email: 'professor@example.com',
    name: 'Professor Name',
    role: 'Professor',
  };

  const mockClassroom: Classroom = {
    code: 'abc123def',
    name: 'Test Classroom',
    invite_expiration: new Date('2024-12-31'),
    created_by: 'user-123',
    created_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassroomController],
      providers: [
        {
          provide: CLASSROOM_SERVICE_TOKEN,
          useValue: mockClassroomService,
        },
      ],
    }).compile();

    controller = module.get<ClassroomController>(ClassroomController);
    service = module.get<ClassroomService>(CLASSROOM_SERVICE_TOKEN);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a classroom', async () => {
      const createDto: CreateClassroomDto = {
        name: 'New Classroom',
        invite_expiration: new Date('2024-12-31'),
      };

      mockClassroomService.create.mockResolvedValue(mockClassroom);

      const result = await controller.create(createDto, mockUser);

      expect(service.create).toHaveBeenCalledWith(createDto, mockUser.id);
      expect(result).toEqual(mockClassroom);
    });
  });

  describe('findAllByUserId', () => {
    it('should return all classrooms for a user', async () => {
      const classrooms = [mockClassroom];
      mockClassroomService.findAllByUserId.mockResolvedValue(classrooms);

      const result = await controller.findAllByUserId(mockUser);

      expect(service.findAllByUserId).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(classrooms);
    });
  });

  describe('findOne', () => {
    it('should return a classroom by code', async () => {
      const code = 'abc123def';
      mockClassroomService.findOne.mockResolvedValue(mockClassroom);

      const result = await controller.findOne(code);

      expect(service.findOne).toHaveBeenCalledWith(code);
      expect(result).toEqual(mockClassroom);
    });
  });

  describe('update', () => {
    it('should update a classroom', async () => {
      const code = 'abc123def';
      const updateDto: UpdateClassroomDto = {
        name: 'Updated Classroom',
      };

      const updatedClassroom = { ...mockClassroom, ...updateDto };
      mockClassroomService.update.mockResolvedValue(updatedClassroom);

      const result = await controller.update(code, updateDto);

      expect(service.update).toHaveBeenCalledWith(code, updateDto);
      expect(result).toEqual(updatedClassroom);
    });
  });

  describe('remove', () => {
    it('should remove a classroom', async () => {
      const code = 'abc123def';
      mockClassroomService.remove.mockResolvedValue(undefined);

      await controller.remove(code);

      expect(service.remove).toHaveBeenCalledWith(code);
    });
  });
});
