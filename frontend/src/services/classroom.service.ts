import { apiClient } from "@/lib/api-client";

export interface ClassroomMarathon {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  start_date: string;
  end_date: string | null;
  enrollments?: Array<{
    id: string;
  }>;
}

export interface Classroom {
  id: string;
  name: string;
  invite_expiration: string | null;
  created_at: string;
  created_by: string;
  marathons?: ClassroomMarathon[];
}

// Interface que corresponde ao que o backend retorna em findOne
export interface ClassroomWithMarathonsAndEnrollments {
  id: string;
  name: string;
  invite_expiration: string | null;
  created_at: string;
  created_by: string;
  marathons?: ClassroomMarathon[];
}

export interface ClassroomWithMarathonIds {
  id: string;
  name: string;
  invite_expiration: string | null;
  created_at: string;
  created_by: string;
  marathons: Array<{
    id: string;
  }>;
}

export interface CreateClassroomRequest {
  name: string;
}

export interface UpdateClassroomRequest {
  name?: string;
}

export class ClassroomService {
  private static readonly BASE_URL = "/classroom";

  // GET /classroom - findAllByUserId (uses current user from JWT)
  static async findAllByUser(): Promise<ClassroomWithMarathonIds[]> {
    return apiClient.get<ClassroomWithMarathonIds[]>(ClassroomService.BASE_URL);
  }

  // GET /classroom/:id - findOne (returns classroom with marathons and enrollments)
  static async findOne(
    id: string
  ): Promise<ClassroomWithMarathonsAndEnrollments> {
    return apiClient.get<ClassroomWithMarathonsAndEnrollments>(
      `${ClassroomService.BASE_URL}/${id}`
    );
  }

  // POST /classroom - create
  static async create(data: CreateClassroomRequest): Promise<Classroom> {
    return apiClient.post<Classroom>(ClassroomService.BASE_URL, data);
  }

  // PATCH /classroom/:id - update
  static async update(
    id: string,
    data: UpdateClassroomRequest
  ): Promise<Classroom> {
    return apiClient.patch<Classroom>(
      `${ClassroomService.BASE_URL}/${id}`,
      data
    );
  }

  // DELETE /classroom/:id - remove
  static async remove(id: string): Promise<void> {
    return apiClient.delete<void>(`${ClassroomService.BASE_URL}/${id}`);
  }
}
