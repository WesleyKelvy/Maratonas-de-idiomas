import { z } from "zod";

// Question validation schema
export const questionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Título é obrigatório")
    .min(3, "Título deve ter pelo menos 3 caracteres")
    .max(100, "Título deve ter no máximo 100 caracteres"),

  prompt_text: z
    .string()
    .trim()
    .min(1, "Enunciado é obrigatório")
    .min(10, "Enunciado deve ter pelo menos 10 caracteres")
    .max(2000, "Enunciado deve ter no máximo 2000 caracteres"),
});

// Array of questions schema
export const questionsArraySchema = z
  .array(questionSchema)
  .min(1, "Deve haver pelo menos uma questão")
  .max(50, "Máximo de 50 questões por vez");

// Edit question form schema (for the dialog)
export const editQuestionFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Título é obrigatório")
    .min(3, "Título deve ter pelo menos 3 caracteres")
    .max(100, "Título deve ter no máximo 100 caracteres"),

  prompt_text: z
    .string()
    .trim()
    .min(1, "Enunciado é obrigatório")
    .min(10, "Enunciado deve ter pelo menos 10 caracteres")
    .max(2000, "Enunciado deve ter no máximo 2000 caracteres"),
});

// Update question schema (for API calls)
export const updateQuestionSchema = z.object({
  title: z.string().trim().min(3).max(100).optional(),
  prompt_text: z.string().trim().min(10).max(2000).optional(),
});

// Type exports
export type QuestionFormData = z.infer<typeof questionSchema>;
export type EditQuestionFormData = z.infer<typeof editQuestionFormSchema>;
export type UpdateQuestionData = z.infer<typeof updateQuestionSchema>;
export type QuestionsArrayData = z.infer<typeof questionsArraySchema>;
