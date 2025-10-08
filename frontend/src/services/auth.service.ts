import { apiClient } from "@/lib/api-client";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  birthDate: string;
  city: string;
  occupation: string;
  role: "student" | "teacher";
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    verified: boolean;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "Student" | "Professor" | "Admin";
  city?: string;
  occupation?: string;
  birthdate?: string;
  verified: boolean;
}

export interface RefreshTokenResponse {
  message: string;
}

export interface VerifyAccountRequest {
  code: string;
}

export interface VerifyAccountResponse {
  message: string;
}

export interface RequestPasswordResetRequest {
  email: string;
}

export interface RequestPasswordResetResponse {
  message: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export class AuthService {
  static async login(data: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>("/login", data);
  }

  static async register(data: RegisterRequest): Promise<RegisterResponse> {
    // Mapear para o formato esperado pelo backend
    const backendData = {
      name: data.name,
      email: data.email,
      password: data.password,
      birthdate: data.birthDate, // Backend espera 'birthdate' não 'birthDate'
      city: data.city,
      occupation: data.occupation,
      role: data.role === "teacher" ? "Professor" : "Student", // Mapear roles
    };
    return apiClient.post<RegisterResponse>("/user", backendData);
  }

  static async refreshToken(): Promise<RefreshTokenResponse> {
    return apiClient.post<RefreshTokenResponse>("/refresh-user-token");
  }

  static async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<{ data: User; message: string }>(
      "/user/me"
    );
    return response.data;
  }

  static async logout(): Promise<void> {
    // Como não há endpoint de logout no backend, apenas limpamos localmente
    // O cookie será limpo pelo SameSite policy
    return Promise.resolve();
  }

  static async verifyAccount(
    data: VerifyAccountRequest
  ): Promise<VerifyAccountResponse> {
    return apiClient.post<VerifyAccountResponse>(
      "/user/confirm-account",
      data.code
    );
  }

  static async requestPasswordReset(
    data: RequestPasswordResetRequest
  ): Promise<RequestPasswordResetResponse> {
    return apiClient.post<RequestPasswordResetResponse>(
      "/user/send-email-password-reset",
      data
    );
  }

  static async resetPassword(
    data: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> {
    // O backend espera token como query param e newPassword no body
    return apiClient.post<ResetPasswordResponse>(
      `/user/reset-password?token=${data.code}`,
      { newPassword: data.newPassword }
    );
  }
}
