import {
  Role,
  StudentStats as PrismaStudentStats,
  ProfessorStats as PrismaTeacherStats,
} from '@prisma/client';

export class User {
  id: string; // Changed to string to match uuid()
  name: string;
  email: string;
  passwordHash: string;
  birthdate: string;
  city: string;
  occupation: string;
  role: Role;

  resetToken?: string;
  resetTokenExpiration?: Date;

  studentStats?: PrismaStudentStats; // Include the relation
  teacherStats?: PrismaTeacherStats; // Include the relation

  // Add other relations if you have custom entities for them
  // classroomsCreated?: Classroom[];
  // enrollments?: Enrollment[];
  // submissions?: Submission[];
  // leaderboard?: Leaderboard[];
  // LanguageMarathon?: LanguageMarathon[];
}
