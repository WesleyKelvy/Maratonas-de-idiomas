import { z } from "zod";

// Schema para Login
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email deve ter um formato válido"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres"),
});

// Schema para Register
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nome é obrigatório")
      .min(2, "Nome deve ter pelo menos 2 caracteres")
      .max(100, "Nome deve ter no máximo 100 caracteres"),
    email: z
      .string()
      .min(1, "Email é obrigatório")
      .email("Email deve ter um formato válido"),
    password: z
      .string()
      .min(1, "Senha é obrigatória")
      .min(8, "Senha deve ter pelo menos 8 caracteres")
      .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
      .regex(/[0-9]/, "Senha deve conter pelo menos um número"),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
    birthDate: z
      .string()
      .min(1, "Data de nascimento é obrigatória")
      .refine((date) => {
        const birthDate = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        return age >= 13;
      }, "Você deve ter pelo menos 13 anos"),
    city: z
      .string()
      .min(1, "Cidade é obrigatória")
      .min(2, "Cidade deve ter pelo menos 2 caracteres")
      .max(100, "Cidade deve ter no máximo 100 caracteres"),
    occupation: z
      .string()
      .min(1, "Ocupação é obrigatória")
      .min(2, "Ocupação deve ter pelo menos 2 caracteres")
      .max(100, "Ocupação deve ter no máximo 100 caracteres"),
    role: z.enum(["student", "teacher"], {
      required_error: "Tipo de perfil é obrigatório",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

// Schema para solicitação de reset de senha
export const requestPasswordResetSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email deve ter um formato válido"),
});

// Schema para redefinir senha (com token da URL)
export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, "Nova senha é obrigatória")
      .min(8, "Senha deve ter pelo menos 8 caracteres")
      .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
      .regex(/[0-9]/, "Senha deve conter pelo menos um número"),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

// Schema para verificação de conta
export const verifyAccountSchema = z.object({
  confirmationCode: z
    .string()
    .length(9, "Código deve ter exatamente 9 caracteres"),
});

// Tipos TypeScript derivados dos schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type RequestPasswordResetFormData = z.infer<
  typeof requestPasswordResetSchema
>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type VerifyAccountFormData = z.infer<typeof verifyAccountSchema>;
