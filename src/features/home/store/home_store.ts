import { create } from "zustand";

import { homeApi } from "../api/home_api";
import { ConsistencyData, UserDetail } from "../models/home_models";

interface HomeState {
  user: UserDetail | null;
  consistency: ConsistencyData | null;

  isLoading: boolean;
  error: string | null;

  loadHome: () => Promise<void>;
  clearHome: () => void;
}

export const useHomeStore = create<HomeState>((set) => ({
  user: null,
  consistency: null,

  isLoading: false,
  error: null,

  loadHome: async () => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const [userResponse, consistencyResponse] = await Promise.all([
        homeApi.getUserDetail(),
        homeApi.getConsistency(),
      ]);

      set({
        user: userResponse.data,
        consistency: consistencyResponse.data,
        isLoading: false,
      });
    } catch (error: any) {
      console.error(
        "❌ [HomeStore] Failed to load home:",
        error?.response?.data ?? error?.message,
      );

      set({
        isLoading: false,
        error: error?.response?.data?.message ?? "Failed to load home data.",
      });
    }
  },

  clearHome: () => {
    set({
      user: null,
      consistency: null,
      error: null,
    });
  },
}));
