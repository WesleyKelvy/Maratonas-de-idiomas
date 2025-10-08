import React, { createContext, useContext } from "react";
import {
  useCurrentUser,
  useLogin,
  useRegister,
  useLogout,
  useVerifyAccount,
  useResetPassword,
  useRequestPasswordReset,
} from "@/hooks/use-auth";
import { User } from "@/services/auth.service";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  verifyAccount: (code: string) => Promise<void>;
  resetPassword: (
    email: string,
    code: string,
    newPassword: string
  ) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  birthDate: string;
  city: string;
  occupation: string;
  role: "student" | "teacher";
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Usar os hooks do TanStack Query
  const { data: user, isLoading, error } = useCurrentUser();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();
  const verifyAccountMutation = useVerifyAccount();
  const resetPasswordMutation = useResetPassword();
  const requestPasswordResetMutation = useRequestPasswordReset();

  // Log para debugging

  // Considerar autenticado se o usuário existe (remover verificação de verified por enquanto)
  const isAuthenticated = !!user;

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const register = async (userData: RegisterData) => {
    const registerData = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      birthDate: userData.birthDate,
      city: userData.city,
      occupation: userData.occupation,
      role: userData.role,
    };
    await registerMutation.mutateAsync(registerData);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const verifyAccount = async (code: string) => {
    await verifyAccountMutation.mutateAsync({ code });
  };

  const resetPassword = async (
    email: string,
    code: string,
    newPassword: string
  ) => {
    await resetPasswordMutation.mutateAsync({ email, code, newPassword });
  };

  const requestPasswordReset = async (email: string) => {
    await requestPasswordResetMutation.mutateAsync({ email });
  };

  const value = {
    user: user || null,
    isAuthenticated,
    loading: isLoading,
    login,
    register,
    logout,
    verifyAccount,
    resetPassword,
    requestPasswordReset,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
