import { EnrollmentModule } from '../enrollment.module';

describe('EnrollmentModule', () => {
  it('should be defined', () => {
    expect(EnrollmentModule).toBeDefined();
  });

  it('should be a class', () => {
    expect(typeof EnrollmentModule).toBe('function');
  });

  it('should have a name', () => {
    expect(EnrollmentModule.name).toBe('EnrollmentModule');
  });

  it('should be importable', () => {
    expect(() => {
      import('../enrollment.module');
    }).not.toThrow();
  });
});
