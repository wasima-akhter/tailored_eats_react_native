import { API_ENDPOINTS } from "../../../core/constants/api_endpoints";
import { apiClient } from "../../../core/network/api_client";

import { ConsistencyResponse, UserDetailResponse } from "../models/home_models";

export const homeApi = {
  async getUserDetail(): Promise<UserDetailResponse> {
    const response = await apiClient.get<UserDetailResponse>(
      API_ENDPOINTS.user.userDetail,
    );

    return response.data;
  },

  async getConsistency(): Promise<ConsistencyResponse> {
    const response = await apiClient.get<ConsistencyResponse>(
      API_ENDPOINTS.consistency.userConsistencyDetails,
    );

    return response.data;
  },
};
