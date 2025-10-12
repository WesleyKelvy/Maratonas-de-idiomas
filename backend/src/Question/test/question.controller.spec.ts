import { Test, TestingModule } from '@nestjs/testing';
import { QuestionController } from '../question.controller';
import { QUESTION_SERVICE_TOKEN } from '../abstract-services/abstract-question.service';
import { LANGUAGE_MARATHON_SERVICE_TOKEN } from '../../LanguageMarathon/abstract-services/abstract-language-marathon.service';
import { UpdateQuestionDto } from '../dto/question.update.dto';
import { QuestionArray } from '../interfaces/geminiResponse';
import { GenerateQuestions } from '../interfaces/GenerateQuestions';
import { Question } from '@prisma/client';

describe('QuestionController', () => {
  let controller: QuestionController;
  let mockQuestionService: any;
  let mockMarathonService: any;

  const mockQuestionService_obj = {
    generateQuestionsWithGemini: jest.fn(),
    create: jest.fn(),
    findAllByMarathonId: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockMarathonService_obj = {
    findOne: jest.fn(),
  };

  const mockQuestion: Question = {
    id: 1,
    marathon_id: 'marathon-123',
    title: 'Test Question',
    prompt_text: 'What is the capital of France?',
  };

  const mockQuestionArray = [
    { question_text: 'What is the capital of France?' },
    { question_text: 'What is the largest planet?' },
  ];

  const mockMarathon = {
    id: 'marathon-123',
    title: 'Test Marathon',
    context: 'Test context',
    difficulty: 'Beginner',
    number_of_questions: 5,
  };

  const mockGenerateQuestionsDto: GenerateQuestions = {
    context: 'Test context',
    difficulty: 'Beginner',
    number_of_questions: 5,
  };

  const mockQuestionArrayDto: QuestionArray = [
    { title: 'teste1', prompt_text: 'What is the capital of France?' },
    { title: 'teste1', prompt_text: 'What is the largest planet?' },
  ];

  const mockUpdateQuestionDto: UpdateQuestionDto = {
    title: 'Updated Question',
    prompt_text: 'Updated prompt text',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionController],
      providers: [
        {
          provide: QUESTION_SERVICE_TOKEN,
          useValue: mockQuestionService_obj,
        },
        {
          provide: LANGUAGE_MARATHON_SERVICE_TOKEN,
          useValue: mockMarathonService_obj,
        },
      ],
    }).compile();

    controller = module.get<QuestionController>(QuestionController);
    mockQuestionService = module.get(QUESTION_SERVICE_TOKEN);
    mockMarathonService = module.get(LANGUAGE_MARATHON_SERVICE_TOKEN);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getGeminiQuestions', () => {
    it('should get Gemini questions for a marathon', async () => {
      const marathonId = 'marathon-123';
      mockMarathonService.findOne.mockResolvedValue(mockMarathon);
      mockQuestionService.generateQuestionsWithGemini.mockResolvedValue(
        mockQuestionArray,
      );

      const result = await controller.getGeminiQuestions(marathonId);

      expect(mockMarathonService.findOne).toHaveBeenCalledWith(marathonId);
      expect(
        mockQuestionService.generateQuestionsWithGemini,
      ).toHaveBeenCalledWith(mockMarathon);
      expect(result).toEqual(mockQuestionArray);
    });

    it('should handle different marathon IDs', async () => {
      const marathonId = 'marathon-456';
      const differentMarathon = { ...mockMarathon, id: marathonId };
      mockMarathonService.findOne.mockResolvedValue(differentMarathon);
      mockQuestionService.generateQuestionsWithGemini.mockResolvedValue(
        mockQuestionArray,
      );

      const result = await controller.getGeminiQuestions(marathonId);

      expect(mockMarathonService.findOne).toHaveBeenCalledWith(marathonId);
      expect(
        mockQuestionService.generateQuestionsWithGemini,
      ).toHaveBeenCalledWith(differentMarathon);
      expect(result).toEqual(mockQuestionArray);
    });
  });

  describe('sabeQuestions', () => {
    it('should save questions for a marathon', async () => {
      const marathonId = 'marathon-123';
      const questions = [mockQuestion];
      mockQuestionService.create.mockResolvedValue(questions);

      const result = await controller.saveQuestions(
        marathonId,
        mockQuestionArrayDto,
      );

      expect(mockQuestionService.create).toHaveBeenCalledWith(
        mockQuestionArrayDto,
        marathonId,
      );
      expect(result).toEqual(questions);
    });

    it('should handle different marathon IDs for saving questions', async () => {
      const marathonId = 'marathon-456';
      const questions = [mockQuestion];
      mockQuestionService.create.mockResolvedValue(questions);

      const result = await controller.saveQuestions(
        marathonId,
        mockQuestionArrayDto,
      );

      expect(mockQuestionService.create).toHaveBeenCalledWith(
        mockQuestionArrayDto,
        marathonId,
      );
      expect(result).toEqual(questions);
    });
  });

  describe('generateQuestions', () => {
    it('should generate questions using Gemini', async () => {
      mockQuestionService.generateQuestionsWithGemini.mockResolvedValue(
        mockQuestionArray,
      );

      const result = await controller.getGeminiQuestions();

      expect(
        mockQuestionService.generateQuestionsWithGemini,
      ).toHaveBeenCalledWith(mockGenerateQuestionsDto);
      expect(result).toEqual(mockQuestionArray);
    });

    it('should handle different question generation parameters', async () => {
      const differentDto: GenerateQuestions = {
        context: 'Advanced context',
        difficulty: 'Advanced',
        number_of_questions: 10,
      };
      mockQuestionService.generateQuestionsWithGemini.mockResolvedValue(
        mockQuestionArray,
      );

      const result = await controller.getGeminiQuestions();

      expect(
        mockQuestionService.generateQuestionsWithGemini,
      ).toHaveBeenCalledWith(differentDto);
      expect(result).toEqual(mockQuestionArray);
    });
  });

  describe('findAllByMarathonId', () => {
    it('should return all questions for a marathon', async () => {
      const marathonId = 'marathon-123';
      const questions = [mockQuestion];
      mockQuestionService.findAllByMarathonId.mockResolvedValue(questions);

      const result = await controller.findAllByMarathonId(marathonId);

      expect(mockQuestionService.findAllByMarathonId).toHaveBeenCalledWith(
        marathonId,
      );
      expect(result).toEqual(questions);
    });

    it('should handle different marathon IDs', async () => {
      const marathonId = 'marathon-456';
      const questions = [mockQuestion];
      mockQuestionService.findAllByMarathonId.mockResolvedValue(questions);

      const result = await controller.findAllByMarathonId(marathonId);

      expect(mockQuestionService.findAllByMarathonId).toHaveBeenCalledWith(
        marathonId,
      );
      expect(result).toEqual(questions);
    });
  });

  describe('findOne', () => {
    it('should return a question by ID', async () => {
      const questionId = 1;
      mockQuestionService.findOne.mockResolvedValue(mockQuestion);

      const result = await controller.findOne(questionId);

      expect(mockQuestionService.findOne).toHaveBeenCalledWith(questionId);
      expect(result).toEqual(mockQuestion);
    });

    it('should handle different question IDs', async () => {
      const questionId = 999;
      const differentQuestion = { ...mockQuestion, id: questionId };
      mockQuestionService.findOne.mockResolvedValue(differentQuestion);

      const result = await controller.findOne(questionId);

      expect(mockQuestionService.findOne).toHaveBeenCalledWith(questionId);
      expect(result).toEqual(differentQuestion);
    });
  });

  describe('update', () => {
    it('should update a question', async () => {
      const questionId = 1;
      const updatedQuestion = { ...mockQuestion, ...mockUpdateQuestionDto };
      mockQuestionService.update.mockResolvedValue(updatedQuestion);

      const result = await controller.update(questionId, mockUpdateQuestionDto);

      expect(mockQuestionService.update).toHaveBeenCalledWith(
        questionId,
        mockUpdateQuestionDto,
      );
      expect(result).toEqual(updatedQuestion);
    });

    it('should handle different question IDs for update', async () => {
      const questionId = 999;
      const updatedQuestion = { ...mockQuestion, id: questionId };
      mockQuestionService.update.mockResolvedValue(updatedQuestion);

      const result = await controller.update(questionId, mockUpdateQuestionDto);

      expect(mockQuestionService.update).toHaveBeenCalledWith(
        questionId,
        mockUpdateQuestionDto,
      );
      expect(result).toEqual(updatedQuestion);
    });
  });

  describe('remove', () => {
    it('should remove a question', async () => {
      const questionId = 1;
      mockQuestionService.remove.mockResolvedValue(undefined);

      await controller.remove(questionId);

      expect(mockQuestionService.remove).toHaveBeenCalledWith(questionId);
    });

    it('should handle different question IDs for removal', async () => {
      const questionId = 999;
      mockQuestionService.remove.mockResolvedValue(undefined);

      await controller.remove(questionId);

      expect(mockQuestionService.remove).toHaveBeenCalledWith(questionId);
    });
  });
});
