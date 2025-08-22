import { QuestionModule } from '../question.module';

describe('QuestionModule', () => {
  it('should be defined', () => {
    expect(QuestionModule).toBeDefined();
  });

  it('should be a class', () => {
    expect(typeof QuestionModule).toBe('function');
  });

  it('should have a name', () => {
    expect(QuestionModule.name).toBe('QuestionModule');
  });

  it('should be importable', () => {
    expect(() => {
      import('../question.module');
    }).not.toThrow();
  });
});

