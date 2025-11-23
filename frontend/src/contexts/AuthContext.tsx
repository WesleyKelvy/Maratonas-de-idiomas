import {
  useCurrentUser,
  useLogin,
  useLogout,
  useRegister,
  useRequestPasswordReset,
  useResetPassword,
  useResendCode,
  useVerifyAccount,
} from "@/hooks/use-auth";
import { User } from "@/services/auth.service";
import React, { createContext, useContext } from "react";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  verifyAccount: (code: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resendVerificationCode: () => Promise<void>;
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
  const resendCodeMutation = useResendCode();

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

  const verifyAccount = async (confirmationCode: string) => {
    await verifyAccountMutation.mutateAsync({ confirmationCode });
  };

  const resetPassword = async (token: string, newPassword: string) => {
    await resetPasswordMutation.mutateAsync({ token, newPassword });
  };

  const requestPasswordReset = async (email: string) => {
    await requestPasswordResetMutation.mutateAsync({ email });
  };

  const resendVerificationCode = async () => {
    await resendCodeMutation.mutateAsync();
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
    resendVerificationCode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
