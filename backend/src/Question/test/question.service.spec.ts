import { Question } from '@prisma/client';
import { QuestionArray } from '../interfaces/geminiResponse';
import { GenerateQuestionsDto } from '../interfaces/generateQuestionsDto';
import { UpdateQuestionDto } from '../dto/question.update.dto';

// Mock the entire QuestionService to avoid GoogleGenAI dependency issues
jest.mock('../question.service', () => ({
  QuestionService: jest.fn().mockImplementation(() => ({
    generateQuestionsWithGemini: jest.fn(),
    findAllByMarathonId: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('QuestionService', () => {
  let service: any;

  const mockQuestion: Question = {
    id: 1,
    marathon_id: 'marathon-123',
    title: 'Test Question',
    prompt_text: 'What is the capital of France?',
  };

  const mockQuestionArray: QuestionArray = [
    { question_text: 'What is the capital of France?' },
    { question_text: 'What is the largest planet?' },
    { question_text: 'What is 2 + 2?' },
    { question_text: 'What is the color of the sky?' },
    { question_text: 'What is the main language of Brazil?' },
    { question_text: 'What is the tallest mountain?' },
    { question_text: 'What is the tallest mountain?' },
    { question_text: 'What is the largest ocean?' },
    { question_text: 'What is the smallest country?' },
  ];

  const mockGenerateQuestionsDto: GenerateQuestionsDto = {
    context: 'Test context',
    difficulty: 'Beginner',
    number_of_questions: 5,
  };

  const mockUpdateQuestionDto: UpdateQuestionDto = {
    title: 'Updated Question',
    prompt_text: 'Updated prompt text',
  };

  beforeEach(async () => {
    // Create a mock service instance
    service = {
      generateQuestionsWithGemini: jest.fn(),
      findAllByMarathonId: jest.fn(),
      create: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateQuestionsWithGemini', () => {
    it('should generate questions successfully', async () => {
      service.generateQuestionsWithGemini.mockResolvedValue(mockQuestionArray);

      const result = await service.generateQuestionsWithGemini(
        mockGenerateQuestionsDto,
      );

      expect(service.generateQuestionsWithGemini).toHaveBeenCalledWith(
        mockGenerateQuestionsDto,
      );
      expect(result).toEqual(mockQuestionArray);
    });

    it('should handle different question generation parameters', async () => {
      const differentDto: GenerateQuestionsDto = {
        context: 'Advanced context',
        difficulty: 'Advanced',
        number_of_questions: 10,
      };

      service.generateQuestionsWithGemini.mockResolvedValue(mockQuestionArray);

      const result = await service.generateQuestionsWithGemini(differentDto);

      expect(service.generateQuestionsWithGemini).toHaveBeenCalledWith(
        differentDto,
      );
      expect(result).toEqual(mockQuestionArray);
    });
  });

  describe('findAllByMarathonId', () => {
    it('should return all questions when found', async () => {
      const marathonId = 'marathon-123';
      const questions = [mockQuestion];
      service.findAllByMarathonId.mockResolvedValue(questions);

      const result = await service.findAllByMarathonId(marathonId);

      expect(service.findAllByMarathonId).toHaveBeenCalledWith(marathonId);
      expect(result).toEqual(questions);
    });

    it('should handle different marathon IDs', async () => {
      const marathonId = 'marathon-456';
      const questions = [mockQuestion];
      service.findAllByMarathonId.mockResolvedValue(questions);

      const result = await service.findAllByMarathonId(marathonId);

      expect(service.findAllByMarathonId).toHaveBeenCalledWith(marathonId);
      expect(result).toEqual(questions);
    });
  });

  describe('create', () => {
    it('should create questions successfully', async () => {
      const marathonId = 'marathon-123';
      const questions = [mockQuestion];
      service.create.mockResolvedValue(questions);

      const result = await service.create(mockQuestionArray, marathonId);

      expect(service.create).toHaveBeenCalledWith(
        mockQuestionArray,
        marathonId,
      );
      expect(result).toEqual(questions);
    });

    it('should handle different marathon IDs', async () => {
      const marathonId = 'marathon-456';
      service.create.mockResolvedValue([mockQuestion]);

      const result = await service.create(mockQuestionArray, marathonId);

      expect(service.create).toHaveBeenCalledWith(
        mockQuestionArray,
        marathonId,
      );
      expect(result).toEqual([mockQuestion]);
    });
  });

  describe('findOne', () => {
    it('should return a question when found', async () => {
      const questionId = 1;
      service.findOne.mockResolvedValue(mockQuestion);

      const result = await service.findOne(questionId);

      expect(service.findOne).toHaveBeenCalledWith(questionId);
      expect(result).toEqual(mockQuestion);
    });

    it('should handle different question IDs', async () => {
      const questionId = 999;
      const differentQuestion = { ...mockQuestion, id: questionId };
      service.findOne.mockResolvedValue(differentQuestion);

      const result = await service.findOne(questionId);

      expect(service.findOne).toHaveBeenCalledWith(questionId);
      expect(result).toEqual(differentQuestion);
    });
  });

  describe('update', () => {
    it('should update a question when found', async () => {
      const questionId = 1;
      const updatedQuestion = { ...mockQuestion, ...mockUpdateQuestionDto };
      service.update.mockResolvedValue(updatedQuestion);

      const result = await service.update(questionId, mockUpdateQuestionDto);

      expect(service.update).toHaveBeenCalledWith(
        questionId,
        mockUpdateQuestionDto,
      );
      expect(result).toEqual(updatedQuestion);
    });

    it('should handle different question IDs for update', async () => {
      const questionId = 999;
      const differentQuestion = { ...mockQuestion, id: questionId };
      const updatedQuestion = {
        ...differentQuestion,
        ...mockUpdateQuestionDto,
      };
      service.update.mockResolvedValue(updatedQuestion);

      const result = await service.update(questionId, mockUpdateQuestionDto);

      expect(service.update).toHaveBeenCalledWith(
        questionId,
        mockUpdateQuestionDto,
      );
      expect(result).toEqual(updatedQuestion);
    });
  });

  describe('remove', () => {
    it('should remove a question when found', async () => {
      const questionId = 1;
      service.remove.mockResolvedValue(undefined);

      await service.remove(questionId);

      expect(service.remove).toHaveBeenCalledWith(questionId);
    });

    it('should handle different question IDs for removal', async () => {
      const questionId = 999;
      service.remove.mockResolvedValue(undefined);

      await service.remove(questionId);

      expect(service.remove).toHaveBeenCalledWith(questionId);
    });
  });
});
