import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
  city?: string;
  occupation?: string;
  birthDate?: string;
  verified: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
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
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockUser: User = {
      id: "1",
      name: "João Silva",
      email: email,
      role: email.includes("teacher") ? "teacher" : "student",
      city: "São Paulo",
      occupation: "Estudante",
      verified: true,
    };

    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(mockUser));
  };

  const register = async (userData: RegisterData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      city: userData.city,
      occupation: userData.occupation,
      birthDate: userData.birthDate,
      verified: false,
    };

    setUser(newUser);
    localStorage.setItem("pendingUser", JSON.stringify(newUser));
  };

  const verifyAccount = async (code: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const pendingUser = localStorage.getItem("pendingUser");
    if (pendingUser) {
      const user = JSON.parse(pendingUser);
      user.verified = true;
      setUser(user);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.removeItem("pendingUser");
    }
  };

  const requestPasswordReset = async (email: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const resetPassword = async (
    email: string,
    code: string,
    newPassword: string
  ) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    verifyAccount,
    resetPassword,
    requestPasswordReset,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
