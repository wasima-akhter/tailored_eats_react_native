import { create } from "zustand";

import { profileApi } from "../api/profile_api";
import { Profile, UpdateProfilePayload } from "../models/profile_models";

interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;

  loadProfile: () => Promise<void>;

  updateProfile: (
    payload: UpdateProfilePayload,
    imageUri?: string,
  ) => Promise<void>;

  clearError: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,

  isLoading: false,
  isUpdating: false,

  error: null,

  loadProfile: async () => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await profileApi.getProfile();

      set({
        profile: response.data,
        isLoading: false,
      });
    } catch (error: any) {
      console.error(
        "❌ [ProfileStore] Failed to load profile:",
        error?.response?.data ?? error?.message,
      );

      set({
        isLoading: false,
        error: error?.response?.data?.message ?? "Failed to load profile.",
      });
    }
  },

  updateProfile: async (payload, imageUri) => {
    set({
      isUpdating: true,
      error: null,
    });

    try {
      const response = await profileApi.updateProfile(payload, imageUri);

      set({
        profile: response.data,
        isUpdating: false,
      });
    } catch (error: any) {
      console.error(
        "❌ [ProfileStore] Failed to update profile:",
        error?.response?.data ?? error?.message,
      );

      set({
        isUpdating: false,
        error: error?.response?.data?.message ?? "Failed to update profile.",
      });

      throw error;
    }
  },

  clearError: () => {
    set({
      error: null,
    });
  },
}));
