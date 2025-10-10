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
  private static readonly BASE_URL = "/marathon";

  // GET /marathon/classroom/:id - findAllByClassroomId
  static async findAllByClassroom(
    classroomId: string
  ): Promise<LanguageMarathon[]> {
    return apiClient.get<LanguageMarathon[]>(
      `${MarathonService.BASE_URL}/classroom/${classroomId}`
    );
  }

  // GET /marathon/user/:id - findAllByUserId
  static async findAllByUserId(userId: string): Promise<LanguageMarathon[]> {
    return apiClient.get<LanguageMarathon[]>(
      `${MarathonService.BASE_URL}/user/${userId}`
    );
  }

  // GET /marathon/:id - findOne
  static async findOne(marathonId: string): Promise<LanguageMarathon> {
    return apiClient.get<LanguageMarathon>(
      `${MarathonService.BASE_URL}/${marathonId}`
    );
  }

  // Alias for findOne to maintain backward compatibility
  static async findById(marathonId: string): Promise<LanguageMarathon> {
    return this.findOne(marathonId);
  }

  // POST /marathon/classroom/:id - create
  static async create(
    classroomId: string,
    data: CreateMarathonRequest
  ): Promise<LanguageMarathon> {
    return apiClient.post<LanguageMarathon>(
      `${MarathonService.BASE_URL}/classroom/${classroomId}`,
      data
    );
  }

  // PATCH /marathon/:id - update
  static async update(
    marathonId: string,
    data: UpdateMarathonRequest
  ): Promise<LanguageMarathon> {
    return apiClient.patch<LanguageMarathon>(
      `${MarathonService.BASE_URL}/${marathonId}`,
      data
    );
  }

  // DELETE /marathon/:id - remove
  static async remove(marathonId: string): Promise<void> {
    return apiClient.delete<void>(`${MarathonService.BASE_URL}/${marathonId}`);
  }
}
