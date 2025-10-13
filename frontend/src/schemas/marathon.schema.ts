import { z } from "zod";

// Marathon difficulty enum matching Prisma schema
export const DifficultyEnum = z.enum(["Beginner", "Intermediate", "Advanced"]);

// Form data type (for string inputs from form)
export const createMarathonFormSchema = z
  .object({
    title: z.string().trim().min(1, "Título é obrigatório"),
    description: z.string().trim().optional().or(z.literal("")),
    context: z.string().trim().min(1, "Contexto é obrigatório"),
    difficulty: z.string().min(1, "Dificuldade é obrigatória"),
    timeLimit: z.string().trim().min(1, "Tempo limite é obrigatório"),
    startDate: z.string().trim().min(1, "Data de início é obrigatória"),
    endDate: z.string().optional(),
    number_of_questions: z
      .string()
      .trim()
      .min(1, "Número de questões é obrigatório"),
    classroom_id: z.string().trim().min(1, "Turma é obrigatória"),
  })
  .refine(
    (data) => {
      // Validate timeLimit is a positive number
      const timeLimit = parseInt(data.timeLimit);
      return !isNaN(timeLimit) && timeLimit > 0 && timeLimit <= 480;
    },
    {
      message: "Tempo limite deve ser um número entre 1 e 480 minutos",
      path: ["timeLimit"],
    }
  )
  .refine(
    (data) => {
      // Validate number_of_questions is a positive number
      const numQuestions = parseInt(data.number_of_questions);
      return !isNaN(numQuestions) && numQuestions > 0 && numQuestions <= 50;
    },
    {
      message: "Número de questões deve ser um número entre 1 e 50",
      path: ["number_of_questions"],
    }
  )
  .refine(
    (data) => {
      // Validate difficulty is one of the allowed values
      return ["Beginner", "Intermediate", "Advanced"].includes(data.difficulty);
    },
    {
      message: "Dificuldade deve ser Beginner, Intermediate ou Advanced",
      path: ["difficulty"],
    }
  )
  .refine(
    (data) => {
      // If both dates are provided, endDate should be after startDate
      if (data.startDate && data.endDate) {
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        return endDate > startDate;
      }
      return true;
    },
    {
      message: "Data de fim deve ser posterior à data de início",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => {
      if (data.startDate) {
        const startDate = new Date(data.startDate);

        const minAllowedDate = new Date();
        minAllowedDate.setMinutes(minAllowedDate.getMinutes() + 10);

        return startDate >= minAllowedDate;
      }
      return true;
    },
    {
      message: "Data de início deve ser pelo menos 10 minutos no futuro",
      path: ["startDate"],
    }
  )
  .refine(
    (data) => {
      // If endDate is provided, it should be at least 10 minutes in the future (local time)
      if (data.endDate) {
        const endDate = new Date(data.endDate);

        const minAllowedDate = new Date();
        minAllowedDate.setMinutes(minAllowedDate.getMinutes() + 10);
        return endDate >= minAllowedDate;
      }
      return true;
    },
    {
      message: "Data de fim deve ser pelo menos 10 minutos no futuro",
      path: ["endDate"],
    }
  );

// Type exports
export type CreateMarathonFormData = z.infer<typeof createMarathonFormSchema>;
export type CreateMarathonData = z.infer<typeof createMarathonFormSchema>;
export type DifficultyType = z.infer<typeof DifficultyEnum>;
