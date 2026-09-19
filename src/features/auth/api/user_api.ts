import { API_ENDPOINTS } from "../../../core/constants/api_endpoints";
import { apiClient } from "../../../core/network/api_client";

import { AuthUser } from "../models/auth_models";

interface UserDetailResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: AuthUser;
}

export const userApi = {
  async getUserDetail(): Promise<UserDetailResponse> {
    const response = await apiClient.get<UserDetailResponse>(
      API_ENDPOINTS.user.userDetail,
    );

    return response.data;
  },
};
