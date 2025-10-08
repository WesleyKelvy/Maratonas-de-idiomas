import { Difficulty, PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed process...');

  // 1) Clean up previous seed data to ensure a fresh start
  await prisma.aiFeedbacks.deleteMany(); // Added to clean AI Feedbacks
  await prisma.reportDetails.deleteMany(); // Added to clean Report Details
  await prisma.report.deleteMany(); // Added to clean Reports
  await prisma.submission.deleteMany();
  await prisma.leaderboard.deleteMany(); // Added to clean Leaderboard
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
      accountVerified: true,
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
      accountVerified: true,
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
      accountVerified: true,
    },
  });
  console.log(`Created student: ${student2.name} (${student2.id})`);

  // 4) Create Classroom
  const classroom = await prisma.classroom.create({
    data: {
      id: '01',
      name: 'Português para Testes',
      creator: { connect: { id: professor.id } },
    },
  });
  console.log(`Created classroom: ${classroom.name} (${classroom.id})`);

  // 5) Create LanguageMarathon with a 5-minute duration
  const marathonEndDate = new Date(Date.now() + 1000 * 60 * 1000); // 1 minutes from now
  const marathon = await prisma.languageMarathon.create({
    data: {
      code: 'TEST-01',
      title: 'Maratona de Teste de Relatório',
      context: 'Team work',
      difficulty: Difficulty.Intermediate, // Changed to Intermediate
      timeLimit: 1000, // minutes
      start_date: new Date(),
      end_date: marathonEndDate,
      number_of_questions: 5, // Updated to 5 questions
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
      prompt_text:
        'Describe a situation where a team you were part of faced a significant challenge. How did the team collaborate to overcome it, and what was your specific role in that process?',
      marathon: { connect: { id: marathon.id } },
    },
  });

  const question2 = await prisma.question.create({
    data: {
      prompt_text:
        "In your opinion, what are the most crucial elements for effective teamwork? Provide examples of how these elements contribute to a team's success or failure.",
      marathon: { connect: { id: marathon.id } },
    },
  });

  const question3 = await prisma.question.create({
    data: {
      prompt_text:
        'Imagine a new team is being formed for a project. What steps would you recommend they take to establish strong communication and a positive working environment from the outset?',
      marathon: { connect: { id: marathon.id } },
    },
  });

  const question4 = await prisma.question.create({
    data: {
      prompt_text:
        'Reflect on a time when a team project did not go as planned. Analyze the reasons for the difficulties and suggest alternative approaches the team could have taken to achieve a better outcome.',
      marathon: { connect: { id: marathon.id } },
    },
  });

  const question5 = await prisma.question.create({
    data: {
      prompt_text:
        'How can diverse perspectives and skills within a team contribute to more innovative solutions? Discuss a scenario where varied viewpoints led to a creative breakthrough.',
      marathon: { connect: { id: marathon.id } },
    },
  });
  console.log(`Created 1 questions for marathon: ${marathon.id}`);

  // 7) Enroll both students in the marathon
  await prisma.enrollment.createMany({
    data: [
      {
        user_id: student1.id,
        marathon_id: marathon.id,
        marathon_code: 'TEST-01',
      },
      {
        user_id: student2.id,
        marathon_id: marathon.id,
        marathon_code: 'TEST-01',
      },
    ],
  });
  console.log(
    `Enrolled ${student1.name} and ${student2.name} in the marathon.`,
  );

  // 8) Create submissions and AI feedback from student1 for all 5 questions
  const submission1_q1 = await prisma.submission.create({
    data: {
      question_id: question1.id,
      user_id: student1.id,
      answer:
        'Our team faced a difficult coding bug. We worked together, debugging line by line. My role was checking the logs.',
      score: 8.5,
    },
  });
  await prisma.aiFeedbacks.create({
    data: {
      submissionId: submission1_q1.id,
      explanation:
        'Grammar: The sentence "My role was checking the logs" could be improved for formality. Consider "My role was to check the logs."',
      points_deducted: 1,
      marathon_id: marathon.id,
      category: 'Grammar',
    },
  });

  const submission1_q2 = await prisma.submission.create({
    data: {
      question_id: question2.id,
      user_id: student1.id,
      answer:
        'Communication and trust are vital. Without good communication, misunderstandings happen.',
      score: 9.0,
    },
  });
  await prisma.aiFeedbacks.create({
    data: {
      submissionId: submission1_q2.id,
      explanation:
        'Punctuation: A comma is needed before "Without" in the second sentence for better flow.',
      points_deducted: 0.5,
      marathon_id: marathon.id,
      category: 'Punctuation',
    },
  });

  const submission1_q3 = await prisma.submission.create({
    data: {
      question_id: question3.id,
      user_id: student1.id,
      answer:
        'They should have regular meetings and establish clear roles early.',
      score: 8.8,
    },
  });
  await prisma.aiFeedbacks.create({
    data: {
      submissionId: submission1_q3.id,
      explanation:
        'Vocabulary: "Have regular meetings" could be more formal. Consider "conduct regular meetings."',
      points_deducted: 0.7,
      marathon_id: marathon.id,
      category: 'Vocabulary',
    },
  });

  const submission1_q4 = await prisma.submission.create({
    data: {
      question_id: question4.id,
      user_id: student1.id,
      answer: `'Once, a presentation failed because we didn't practice enough. We should have done more mock runs.'`,
      score: 7.5,
    },
  });
  await prisma.aiFeedbacks.create({
    data: {
      submissionId: submission1_q4.id,
      explanation:
        'Clarity: "Done more mock runs" is a bit informal. Consider "conducted more practice sessions."',
      points_deducted: 1.2,
      marathon_id: marathon.id,
      category: 'Clarity',
    },
  });

  const submission1_q5 = await prisma.submission.create({
    data: {
      question_id: question5.id,
      user_id: student1.id,
      answer:
        'Different ideas lead to better results. In a design project, varied backgrounds helped us innovate.',
      score: 9.2,
    },
  });
  await prisma.aiFeedbacks.create({
    data: {
      submissionId: submission1_q5.id,
      explanation:
        'Cohesion: The connection between the two sentences could be stronger. Consider using a transition word like "For example," or "Indeed,".',
      points_deducted: 0.3,
      marathon_id: marathon.id,
      category: 'Cohesion',
    },
  });

  // Create some submissions for student2 as well (without feedback for this test)
  await prisma.submission.create({
    data: {
      question_id: question1.id,
      user_id: student2.id,
      answer:
        'My team had trouble with project scope. We broke it into smaller tasks. I managed the task list.',
      score: 9.0,
    },
  });

  await prisma.submission.create({
    data: {
      question_id: question2.id,
      user_id: student2.id,
      answer:
        'Respect and clear objectives are key. Without them, teams can become disorganized and inefficient.',
      score: 9.5,
    },
  });

  await prisma.submission.create({
    data: {
      question_id: question3.id,
      user_id: student2.id,
      answer:
        'Regular check-ins and an open-door policy for feedback are crucial to building trust and good vibes.',
      score: 8.7,
    },
  });

  await prisma.submission.create({
    data: {
      question_id: question4.id,
      user_id: student2.id,
      answer:
        'A past group project struggled with uneven workload distribution. We should have assigned responsibilities more clearly from the start and had more frequent progress reviews.',
      score: 8.0,
    },
  });

  await prisma.submission.create({
    data: {
      question_id: question5.id,
      user_id: student2.id,
      answer:
        'When a team has diverse backgrounds, they bring unique perspectives that can lead to more creative and comprehensive solutions. For instance, different cultural insights in a marketing campaign led to broader appeal.',
      score: 9.3,
    },
  });

  // console.log('Created submissions and AI feedbacks for student1.');
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
