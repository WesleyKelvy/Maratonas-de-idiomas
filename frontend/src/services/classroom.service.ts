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

  static async findAllByUser(): Promise<Classroom[]> {
    return apiClient.get<Classroom[]>(ClassroomService.BASE_URL);
  }

  static async findOne(id: string): Promise<Classroom> {
    return apiClient.get<Classroom>(`${ClassroomService.BASE_URL}/${id}`);
  }

  static async create(data: CreateClassroomRequest): Promise<Classroom> {
    return apiClient.post<Classroom>(ClassroomService.BASE_URL, data);
  }

  static async update(
    id: string,
    data: UpdateClassroomRequest
  ): Promise<Classroom> {
    return apiClient.patch<Classroom>(
      `${ClassroomService.BASE_URL}/${id}`,
      data
    );
  }

  static async remove(id: string): Promise<void> {
    return apiClient.delete<void>(`${ClassroomService.BASE_URL}/${id}`);
  }
}
