import { apiClient } from "@/lib/api-client";

export interface UserBasicInfo {
  id: string;
  name: string;
  email: string;
}

export interface GetUsersByIdsDto {
  userIds: string[];
}

export class UserService {
  static async getUsersByIds(userIds: string[]): Promise<UserBasicInfo[]> {
    const response = await apiClient.post<UserBasicInfo[]>(
      "/user/get-users-by-ids",
      {
        userIds,
      }
    );
    return response;
  }
}
