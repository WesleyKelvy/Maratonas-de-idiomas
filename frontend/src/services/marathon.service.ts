import { apiClient } from "@/lib/api-client";

export interface LanguageMarathon {
  id: string;
  code: string;
  title: string;
  description?: string;
  context: string;
  difficulty: string;
  timeLimit: number;
  start_date: string;
  end_date?: string;
  number_of_questions: number;
  leaderboard_generated: boolean;
  classroom_id: string;
  created_by: string;
}

export interface CreateMarathonRequest {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
}

export interface UpdateMarathonRequest {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

export class MarathonService {
  static async findAllByClassroom(
    classroomId: string
  ): Promise<LanguageMarathon[]> {
    return apiClient.get<LanguageMarathon[]>(
      `/classrooms/${classroomId}/marathon`
    );
  }

  static async findOne(
    classroomId: string,
    marathonId: string
  ): Promise<LanguageMarathon> {
    return apiClient.get<LanguageMarathon>(
      `/classrooms/${classroomId}/marathon/${marathonId}`
    );
  }

  // Método alternativo se precisarmos buscar apenas por marathon ID
  static async findById(marathonId: string): Promise<LanguageMarathon> {
    // Assumindo que existe um endpoint direto para buscar maratona por ID
    // Se não existir, precisará ser implementado no backend
    return apiClient.get<LanguageMarathon>(`/marathon/${marathonId}`);
  }

  static async create(
    classroomId: string,
    data: CreateMarathonRequest
  ): Promise<LanguageMarathon> {
    return apiClient.post<LanguageMarathon>(
      `/classrooms/${classroomId}/marathon`,
      data
    );
  }

  static async update(
    classroomId: string,
    marathonId: string,
    data: UpdateMarathonRequest
  ): Promise<LanguageMarathon> {
    return apiClient.patch<LanguageMarathon>(
      `/classrooms/${classroomId}/marathon/${marathonId}`,
      data
    );
  }

  static async remove(classroomId: string, marathonId: string): Promise<void> {
    return apiClient.delete<void>(
      `/classrooms/${classroomId}/marathon/${marathonId}`
    );
  }
}
