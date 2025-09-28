// (to test create leaderboard)
import { Difficulty, PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed process...');

  // 1) Clean up previous seed data to ensure a fresh start
  await prisma.submission.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.question.deleteMany();
  await prisma.languageMarathon.deleteMany();
  await prisma.classroom.deleteMany();
  await prisma.studentStats.deleteMany();
  await prisma.professorStats.deleteMany();
  await prisma.user.deleteMany({
    where: { email: { contains: '@example.com' } },
  });
  console.log('Cleaned up previous data.');

  // 2) Create Professor
  const professor = await prisma.user.create({
    data: {
      name: 'Dr. Beatriz Professor',
      email: 'beatriz.prof@example.com',
      passwordHash: await bcrypt.hash('supersecret', 10),
      birthdate: '1980-08-20',
      city: 'Fortaleza',
      occupation: 'Language Teacher',
      role: Role.Professor,
      ProfessorStats: {
        create: {},
      },
    },
  });
  console.log(`Created professor: ${professor.name} (${professor.id})`);

  // 3) Create Students
  const student1 = await prisma.user.create({
    data: {
      name: 'Alice Student',
      email: 'alice.student@example.com',
      passwordHash: await bcrypt.hash('password123', 10),
      birthdate: '1995-05-15',
      city: 'Fortaleza',
      occupation: 'Learner',
      role: Role.Student,
      studentStats: {
        create: {},
      },
    },
  });
  console.log(`Created student: ${student1.name} (${student1.id})`);

  const student2 = await prisma.user.create({
    data: {
      name: 'Carlos Student',
      email: 'carlos.student@example.com',
      passwordHash: await bcrypt.hash('password456', 10),
      birthdate: '1996-02-20',
      city: 'Juazeiro do Norte',
      occupation: 'Developer',
      role: Role.Student,
      studentStats: {
        create: {},
      },
    },
  });
  console.log(`Created student: ${student2.name} (${student2.id})`);

  // 4) Create Classroom
  const classroom = await prisma.classroom.create({
    data: {
      id: '1',
      name: 'Português para Testes',
      creator: { connect: { id: professor.id } },
    },
  });
  console.log(`Created classroom: ${classroom.name} (${classroom.id})`);

  // 5) Create LanguageMarathon with a 2-minute duration
  const marathonEndDate = new Date(Date.now() + 1000 * 60 * 1); // 1 minutes from now
  const marathon = await prisma.languageMarathon.create({
    data: {
      code: 'CODE-TEST-01',
      title: 'Maratona de Teste Rápido',
      context: 'Team work',
      difficulty: Difficulty.Beginner,
      timeLimit: 0.1, // minutes
      start_date: new Date(),
      end_date: marathonEndDate,
      number_of_questions: 2,
      classroom: { connect: { id: classroom.id } },
      created_by: professor.id,
    },
  });
  console.log(
    `Created marathon: "${marathon.title}" ending at ${marathonEndDate.toLocaleTimeString()}`,
  );

  // 6) Create Questions for the marathon
  const question1 = await prisma.question.create({
    data: {
      prompt_text: 'What is your favorite team activity?',
      marathon: { connect: { id: marathon.id } },
    },
  });

  const question2 = await prisma.question.create({
    data: {
      prompt_text: 'Describe a challenge in group projects.',
      marathon: { connect: { id: marathon.id } },
    },
  });
  console.log(`Created 2 questions for marathon: ${marathon.id}`);

  // 7) Enroll both students in the marathon
  await prisma.enrollment.createMany({
    data: [
      {
        user_id: student1.id,
        marathon_id: marathon.id,
        marathon_code: 'CODE-TEST-01',
      },
      {
        user_id: student2.id,
        marathon_id: marathon.id,
        marathon_code: 'CODE-TEST-01',
      },
    ],
  });
  console.log(
    `Enrolled ${student1.name} and ${student2.name} in the marathon.`,
  );

  // 8) Create submissions from each student for the questions
  await prisma.submission.create({
    data: {
      question_id: question1.id,
      user_id: student1.id,
      answer: 'My favorite activity is brainstorming ideas together.',
      score: 9.5, // Alice's score for Q1
    },
  });

  await prisma.submission.create({
    data: {
      question_id: question2.id,
      user_id: student1.id,
      answer: 'A common challenge is coordinating schedules.',
      score: 8.0,
    },
  });

  await prisma.submission.create({
    data: {
      question_id: question1.id,
      user_id: student2.id,
      answer: 'I enjoy building the final presentation.',
      score: 9.0,
    },
  });
  console.log('Created submissions for both students.');
  console.log(
    'Seed process finished successfully. The leaderboard generation job should be scheduled in Redis.',
  );
}

main()
  .catch((e) => {
    console.error('An error occurred during the seed process:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
