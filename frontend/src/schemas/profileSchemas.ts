import { z } from "zod";

export const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),

  city: z
    .string()
    .min(2, "Cidade deve ter pelo menos 2 caracteres")
    .max(100, "Cidade deve ter no máximo 100 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Cidade deve conter apenas letras e espaços"),

  occupation: z
    .string()
    .min(2, "Ocupação deve ter pelo menos 2 caracteres")
    .max(100, "Ocupação deve ter no máximo 100 caracteres"),

  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD")
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        return age - 1 >= 13;
      }
      return age >= 13;
    }, "Você deve ter pelo menos 13 anos")
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      return birthDate <= today;
    }, "Data de nascimento não pode ser no futuro"),
});

export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
