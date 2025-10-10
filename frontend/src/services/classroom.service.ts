import { apiClient } from "@/lib/api-client";

export interface Classroom {
  id: string;
  name: string;
  description?: string;
  classroomCode: string;
  createdAt: string;
  updatedAt: string;
  professorId: string;
}

export interface CreateClassroomRequest {
  name: string;
  description?: string;
}

export interface UpdateClassroomRequest {
  name?: string;
  description?: string;
}

export class ClassroomService {
  private static readonly BASE_URL = "/classroom";

  // GET /classroom - findAllByUserId (uses current user from JWT)
  static async findAllByUser(): Promise<Classroom[]> {
    return apiClient.get<Classroom[]>(ClassroomService.BASE_URL);
  }

  // GET /classroom/:id - findOne
  static async findOne(id: string): Promise<Classroom> {
    return apiClient.get<Classroom>(`${ClassroomService.BASE_URL}/${id}`);
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
