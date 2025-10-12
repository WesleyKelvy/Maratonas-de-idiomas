import { z } from "zod";

// Classroom validation schema
export const classroomSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nome é obrigatório")
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
});

// Create classroom form schema
export const createClassroomFormSchema = classroomSchema;

// Update classroom form schema
export const updateClassroomFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nome é obrigatório")
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
});

// Type exports
export type ClassroomFormData = z.infer<typeof classroomSchema>;
export type CreateClassroomFormData = z.infer<typeof createClassroomFormSchema>;
export type UpdateClassroomFormData = z.infer<typeof updateClassroomFormSchema>;
