import { create } from "zustand";

import { nutritionApi } from "../api/nutrition_api";
import { Meal } from "../models/nutrition_models";

interface NutritionState {
  meals: Meal[];
  isLoading: boolean;
  error: string | null;

  loadMeals: (mealType?: string) => Promise<void>;
  clearMeals: () => void;
}

export const useNutritionStore = create<NutritionState>((set) => ({
  meals: [],
  isLoading: false,
  error: null,

  loadMeals: async (mealType) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await nutritionApi.getCustomMeals({
        mealType,
        page: 1,
        limit: 20,
      });

      set({
        meals: response.data,
        isLoading: false,
      });
    } catch (error: any) {
      console.error(
        "❌ [NutritionStore] Failed to load meals:",
        error?.response?.data ?? error?.message,
      );

      set({
        isLoading: false,
        error: error?.response?.data?.message ?? "Failed to load meals.",
      });
    }
  },

  clearMeals: () => {
    set({
      meals: [],
      error: null,
    });
  },
}));
