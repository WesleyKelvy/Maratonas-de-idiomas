import { ClassroomModule } from '../classroom.module';

describe('ClassroomModule', () => {
  it('should be defined', () => {
    expect(ClassroomModule).toBeDefined();
  });

  it('should be a class', () => {
    expect(typeof ClassroomModule).toBe('function');
  });

  it('should have a name', () => {
    expect(ClassroomModule.name).toBe('ClassroomModule');
  });

  it('should be importable', () => {
    expect(() => {
      import('../classroom.module');
    }).not.toThrow();
  });
});
