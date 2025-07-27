// prisma/seed.ts
import { PrismaClient, Role, Difficulty } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 1) Create a student
  const student = await prisma.user.create({
    data: {
      name: 'Alice Student',
      email: 'alice.student@example.com',
      passwordHash: await bcrypt.hash('password123', 10),
      birthdate: '1995-05-15',
      city: 'Fortaleza',
      occupation: 'Learner',
      role: Role.Student,
    },
  });
  console.log('Created student:', student.id);

  // 2) Create a professor + stats
  const professor = await prisma.user.create({
    data: {
      name: 'Dr. Beatriz Professor',
      email: 'beatriz.prof@example.com',
      passwordHash: await bcrypt.hash('supersecret', 10),
      birthdate: '1980-08-20',
      city: 'Fortaleza',
      occupation: 'Language Teacher',
      role: Role.Professor,
    },
  });
  console.log('Created professor:', professor.id);

  // create the empty ProfessorStats row
  await prisma.professorStats.create({
    data: { userId: professor.id },
  });
  console.log('Initialized ProfessorStats for:', professor.id);

  // 3) Create one classroom for that professor
  const classroom = await prisma.classroom.create({
    data: {
      code: 'CLASS001',
      name: 'Português Avançado',
      invite_expiration: null,
      creator: { connect: { id: professor.id } },
    },
  });
  console.log('Created classroom:', classroom.code);

  // 4) Create one LanguageMarathon in that classroom
  const marathon = await prisma.languageMarathon.create({
    data: {
      title: 'Team Work at school',
      context: 'Team work',
      difficulty: Difficulty.Beginner,
      timeLimit: 60, // minutos
      start_date: new Date(), // agora
      end_date: new Date(Date.now() + 1000 * 60 * 60), // +1h
      number_of_questions: 1,
      classroom: { connect: { code: classroom.code } },
    },
  });
  console.log('Created marathon:', marathon.id);

  // 5) Create beginner-level questions for the marathon
  const questionsData = [
    {
      prompt_text: 'What do you like about working in a team at school?',
    },
    {
      prompt_text: 'Who do you usually work with in school projects?',
    },
    {
      prompt_text:
        'Describe a good experience you had while working in a group.',
    },
  ];

  for (const q of questionsData) {
    await prisma.question.create({
      data: {
        prompt_text: q.prompt_text,
        marathon: {
          connect: { id: marathon.id },
        },
      },
    });
  }

  console.log(
    `Created ${questionsData.length} questions for marathon:`,
    marathon.id,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
