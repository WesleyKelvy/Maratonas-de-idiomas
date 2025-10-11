import { z } from "zod";

// Marathon difficulty enum matching Prisma schema
export const DifficultyEnum = z.enum(["Beginner", "Intermediate", "Advanced"]);

// Create Marathon Form Schema
export const createMarathonSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Título é obrigatório")
      .min(3, "Título deve ter pelo menos 3 caracteres")
      .max(80, "Título deve ter no máximo 80 caracteres"),

    description: z
      .string()
      .trim()
      .max(500, "Descrição deve ter no máximo 500 caracteres")
      .optional()
      .or(z.literal("")),

    context: z
      .string()
      .trim()
      .min(1, "Contexto é obrigatório")
      .min(10, "Contexto deve ter pelo menos 10 caracteres")
      .max(1000, "Contexto deve ter no máximo 1000 caracteres"),

    difficulty: DifficultyEnum.refine((val) => val !== undefined, {
      message: "Dificuldade é obrigatória",
    }),

    timeLimit: z
      .number({
        required_error: "Tempo limite é obrigatório",
        invalid_type_error: "Tempo limite deve ser um número",
      })
      .int("Tempo limite deve ser um número inteiro")
      .min(1, "Tempo limite deve ser pelo menos 1 minuto")
      .max(480, "Tempo limite deve ser no máximo 8 horas (480 minutos)"),

    startDate: z
      .date({
        invalid_type_error: "Data de início deve ser uma data válida",
      })
      .optional()
      .refine((date) => {
        if (!date) return true;
        return date >= new Date();
      }, "Data de início deve ser no futuro"),

    endDate: z
      .date({
        invalid_type_error: "Data de fim deve ser uma data válida",
      })
      .optional(),

    number_of_questions: z
      .number({
        required_error: "Número de questões é obrigatório",
        invalid_type_error: "Número de questões deve ser um número",
      })
      .int("Número de questões deve ser um número inteiro")
      .min(1, "Deve ter pelo menos 1 questão")
      .max(50, "Máximo de 50 questões por maratona"),

    classroom_id: z.string().trim().min(1, "Turma é obrigatória"),
  })
  .refine(
    (data) => {
      // If both startDate and endDate are provided, endDate should be after startDate
      if (data.startDate && data.endDate) {
        return data.endDate > data.startDate;
      }
      return true;
    },
    {
      message: "Data de fim deve ser posterior à data de início",
      path: ["endDate"],
    }
  );

// Form data type (for string inputs from form)
export const createMarathonFormSchema = z
  .object({
    title: z.string().trim().min(1, "Título é obrigatório"),
    description: z.string().trim().optional().or(z.literal("")),
    context: z.string().trim().min(1, "Contexto é obrigatório"),
    difficulty: z.string().min(1, "Dificuldade é obrigatória"),
    timeLimit: z.string().trim().min(1, "Tempo limite é obrigatório"),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    number_of_questions: z.number().min(1, "Número de questões é obrigatório"),
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
      const numQuestions = data.number_of_questions;
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
      // If startDate is provided, it should be in the future
      if (data.startDate) {
        const startDate = new Date(data.startDate);
        return startDate >= new Date();
      }
      return true;
    },
    {
      message: "Data de início deve ser no futuro",
      path: ["startDate"],
    }
  );

// Type exports
export type CreateMarathonFormData = z.infer<typeof createMarathonFormSchema>;
export type CreateMarathonData = z.infer<typeof createMarathonSchema>;
export type DifficultyType = z.infer<typeof DifficultyEnum>;
