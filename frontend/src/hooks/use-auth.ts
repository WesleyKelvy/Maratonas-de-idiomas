import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AuthService,
  type LoginRequest,
  type RegisterRequest,
  type VerifyAccountRequest,
  type RequestPasswordResetRequest,
  type ResetPasswordRequest,
  type User,
} from "@/services/auth.service";

// Query Keys
export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
} as const;

// Hook para obter usuário atual
export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: AuthService.getCurrentUser,
    retry: (failureCount, error: any) => {
      // Não retry se for erro 401/403 (não autenticado)
      if (error?.status === 401 || error?.status === 403) {
        return false;
      }
      // Retry até 2 vezes para outros erros
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para login
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => AuthService.login(data),
    onSuccess: async () => {
      // Após login bem-sucedido, buscar dados do usuário
      await queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
  });
};

// Hook para registro
export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterRequest) => AuthService.register(data),
  });
};

// Hook para logout
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      // Limpar cache do usuário após logout
      queryClient.removeQueries({ queryKey: authKeys.user() });
      queryClient.clear(); // Limpar todo o cache se necessário
    },
  });
};

// Hook para verificar conta
export const useVerifyAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VerifyAccountRequest) => AuthService.verifyAccount(data),
    onSuccess: async () => {
      // Após verificação, buscar dados atualizados do usuário
      await queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
  });
};

// Hook para solicitar reset de senha
export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: (data: RequestPasswordResetRequest) =>
      AuthService.requestPasswordReset(data),
  });
};

// Hook para resetar senha
export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => AuthService.resetPassword(data),
  });
};

// Hook para refresh token
export const useRefreshToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => AuthService.refreshToken(),
    onSuccess: async () => {
      // Após refresh, invalidar dados do usuário para buscar novamente
      await queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
  });
};
