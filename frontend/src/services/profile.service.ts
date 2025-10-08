import { apiClient } from "@/lib/api-client";

// Interfaces para as estatísticas
export interface StudentStats {
  userId: string;
  total_points: number;
  marathons_participated: number;
  podiums: number;
  first_places: number;
}

export interface ProfessorStats {
  userId: string;
  total_classes: number;
  total_marathons: number;
  total_students_reached: number;
}

export interface LanguageMarathon {
  id: string;
  code: string;
  title: string;
  context: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  timeLimit: number;
  start_date: string;
  end_date: string;
  number_of_questions: number;
  classroom_id: string;
  created_by: string;
}

export interface UserUpdateRequest {
  name: string;
  city: string;
  occupation: string;
  birthdate: string;
}

export class ProfileService {
  // Buscar estatísticas do estudante
  static async getStudentStats(userId: string): Promise<StudentStats | null> {
    const data = await apiClient.get<StudentStats | null>(
      `/student-stats/user/${userId}`
    );

    return data;
  }

  // Buscar estatísticas do professor
  static async getProfessorStats(
    userId: string
  ): Promise<ProfessorStats | null> {
    return apiClient.get<ProfessorStats | null>(
      `/professor-stats/user/${userId}`
    );
  }

  // Buscar maratonas do usuário (como participante ou criador)
  static async getUserMarathons(): Promise<LanguageMarathon[]> {
    // Este endpoint precisará ser implementado ou adaptado
    return apiClient.get<LanguageMarathon[]>("/marathons/user");
  }

  // Atualizar dados do usuário
  static async updateUser(
    data: UserUpdateRequest
  ): Promise<{ message: string; data: any }> {
    return apiClient.patch<{ message: string; data: any }>("/user", {
      name: data.name,
      city: data.city,
      occupation: data.occupation,
      birthdate: data.birthdate,
    });
  }
}
