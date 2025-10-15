import { apiClient } from "@/lib/api-client";
import { ProfessorStats, StudentStats } from "@/services/profile.service";

export interface MarathonQuestion {
  id: number;
  title: string;
  prompt_text: string;
  orderNumber: number;
}

export interface LanguageMarathon {
  id: string;
  code: string;
  title: string;
  description?: string | null;
  context: string;
  difficulty: string;
  timeLimit: number;
  start_date: string;
  end_date?: string | null;
  number_of_questions: number;
  leaderboard_generated: boolean;
  classroom_id: string;
  created_by: string;
  enrollments?: Array<{
    id: string;
    user_id?: string;
  }>;
  classroom?: {
    name: string;
    creator: {
      name: string;
    };
  };
  questions?: MarathonQuestion[];
}

export interface CustomLanguageMarathon {
  id: string;
  title: string;
}

export interface RecentMarathonsAndUserStats {
  marathons: LanguageMarathon[];
  userStats: StudentStats | ProfessorStats | null;
}

export interface CreateMarathonRequest {
  title: string;
  description?: string;
  context: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  timeLimit: number;
  startDate?: Date;
  endDate?: Date;
  number_of_questions: number;
}

export interface UpdateMarathonRequest {
  title?: string;
  description?: string;
  context?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  timeLimit?: number;
  startDate?: Date;
  endDate?: Date;
  number_of_questions?: number;
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

  // GET /marathon/user - findAllByUserId (now uses currentUser from JWT)
  static async findAllByUserId(): Promise<LanguageMarathon[]> {
    return apiClient.get<LanguageMarathon[]>(
      `${MarathonService.BASE_URL}/user`
    );
  }

  // GET /marathon/ids-and-titles - findAllIdsAndTitle (now uses currentUser from JWT)
  static async findAllIdsAndTitle(): Promise<CustomLanguageMarathon[]> {
    return apiClient.get<CustomLanguageMarathon[]>(
      `${MarathonService.BASE_URL}/ids-and-titles`
    );
  }

  // GET /marathon/recent-marathons - findRecentMarathonsAndUserStats (uses currentUser from JWT)
  static async findRecentMarathonsAndUserStats(): Promise<RecentMarathonsAndUserStats> {
    return apiClient.get<RecentMarathonsAndUserStats>(
      `${MarathonService.BASE_URL}/recent-marathons`
    );
  }

  // GET /marathon/:id - findOne
  static async findOne(marathonId: string): Promise<LanguageMarathon> {
    return apiClient.get<LanguageMarathon>(
      `${MarathonService.BASE_URL}/${marathonId}`
    );
  }

  // GET /marathon/:code/:code - findOneByCode (marathon-enrollment screen)
  static async findOneByCode(code: string): Promise<LanguageMarathon> {
    return apiClient.get<LanguageMarathon>(
      `${MarathonService.BASE_URL}/code/${code}`
    );
  }

  // GET /marathon/:id/with-questions - findOneWithQuestions
  static async findOneWithQuestions(
    marathonId: string
  ): Promise<LanguageMarathon> {
    return apiClient.get<LanguageMarathon>(
      `${MarathonService.BASE_URL}/${marathonId}/with-questions`
    );
  }

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
