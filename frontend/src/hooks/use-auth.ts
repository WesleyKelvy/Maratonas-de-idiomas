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

// Estado global para controlar se deve buscar o usuário
const getUserFetchEnabled = () => {
  try {
    const stored = localStorage.getItem("shouldFetchUser");
    return stored !== "false"; // Default true, false apenas se explicitamente definido
  } catch {
    return true;
  }
};

let shouldFetchUser = getUserFetchEnabled();

export const disableUserFetch = () => {
  shouldFetchUser = false;
  try {
    localStorage.setItem("shouldFetchUser", "false");
  } catch {
    // Ignorar erros de localStorage
  }
};

export const enableUserFetch = () => {
  shouldFetchUser = true;
  try {
    localStorage.setItem("shouldFetchUser", "true");
  } catch {
    // Ignorar erros de localStorage
  }
};

// Hook para obter usuário atual
export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: AuthService.getCurrentUser,
    retry: (failureCount, error: any) => {
      // Não retry se for erro 401/403 (não autenticado)
      if (error?.status === 401 || error?.status === 403) {
        // Desabilitar futuras buscas quando receber 401/403
        disableUserFetch();
        return false;
      }
      // Retry até 2 vezes para outros erros
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false, // Não refetch ao focar na janela
    refetchOnMount: true, // Só refetch ao montar o componente
    refetchInterval: false, // Não fazer polling automático
    // Desabilitar a query se shouldFetchUser for false
    enabled: shouldFetchUser,
  });
};

// Hook para login
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => AuthService.login(data),
    onSuccess: async () => {
      // Reabilitar busca de usuário após login bem-sucedido
      enableUserFetch();

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
      // Desabilitar busca de usuário imediatamente
      disableUserFetch();

      // Limpar cache do usuário após logout
      queryClient.removeQueries({ queryKey: authKeys.user() });
      queryClient.clear(); // Limpar todo o cache se necessário

      // Aguardar um pouco antes de redirecionar para evitar requisições residuais
      setTimeout(() => {
        window.location.href = "/login";
      }, 100);
    },
    onError: (error) => {
      // console.error("Logout error:", error);
      // Desabilitar busca de usuário mesmo com erro
      disableUserFetch();
      // Mesmo com erro, limpar cache e redirecionar
      queryClient.clear();
      setTimeout(() => {
        window.location.href = "/login";
      }, 100);
    },
  });
};

// Hook para verificar conta
export const useVerifyAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ confirmationCode }: VerifyAccountRequest) =>
      AuthService.verifyAccount({ confirmationCode }),
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

// Hook para reenviar código de verificação
export const useResendCode = () => {
  return useMutation({
    mutationFn: () => AuthService.resendVerificationCode(),
  });
};
