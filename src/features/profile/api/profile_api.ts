import { API_ENDPOINTS } from "../../../core/constants/api_endpoints";
import { apiClient } from "../../../core/network/api_client";

import {
  ProfileResponse,
  UpdateProfilePayload,
  UpdateProfileResponse,
} from "../models/profile_models";

export const profileApi = {
  async getProfile(): Promise<ProfileResponse> {
    const response = await apiClient.get<ProfileResponse>(
      API_ENDPOINTS.profile.userDetail,
    );

    return response.data;
  },

  async updateProfile(
    payload: UpdateProfilePayload,
    imageUri?: string,
  ): Promise<UpdateProfileResponse> {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    if (imageUri) {
      const filename = imageUri.split("/").pop() ?? "profile.jpg";

      const extension = filename.split(".").pop()?.toLowerCase() ?? "jpg";

      const mimeType = extension === "png" ? "image/png" : "image/jpeg";

      formData.append("profile_image", {
        uri: imageUri,
        name: filename,
        type: mimeType,
      } as any);
    }

    const response = await apiClient.patch<UpdateProfileResponse>(
      API_ENDPOINTS.profile.updateProfile,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  },
};
