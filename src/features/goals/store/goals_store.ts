import { create } from "zustand";

import { goalsApi } from "../api/goals_api";
import {
  CompletedGoalPercentage,
  Goal,
  WeightLog,
} from "../models/goals_models";

interface GoalsState {
  goals: Goal[];
  progress: CompletedGoalPercentage | null;
  weightHistory: WeightLog[];

  isLoading: boolean;
  error: string | null;

  loadGoals: () => Promise<void>;
  loadProgress: () => Promise<void>;
  loadWeightHistory: () => Promise<void>;

  createGoal: (userId: string, title: string) => Promise<void>;

  completeGoal: (goalId: string) => Promise<void>;

  updateGoal: (goalId: string, title: string) => Promise<void>;

  deleteGoal: (goalId: string) => Promise<void>;

  addWeight: (weight: number) => Promise<void>;

  clearError: () => void;
}

export const useGoalsStore = create<GoalsState>((set, get) => ({
  goals: [],
  progress: null,
  weightHistory: [],

  isLoading: false,
  error: null,

  loadGoals: async () => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await goalsApi.getAllGoals();

      set({
        goals: response.data,
        isLoading: false,
      });
    } catch (error: any) {
      console.error(
        "❌ [GoalsStore] Failed to load goals:",
        error?.response?.data ?? error?.message,
      );

      set({
        isLoading: false,
        error: error?.response?.data?.message ?? "Failed to load goals.",
      });
    }
  },

  loadProgress: async () => {
    try {
      const response = await goalsApi.getCompletedGoalPercentage();

      set({
        progress: response.data,
      });
    } catch (error: any) {
      console.error(
        "❌ [GoalsStore] Failed to load progress:",
        error?.response?.data ?? error?.message,
      );
    }
  },

  loadWeightHistory: async () => {
    try {
      const response = await goalsApi.getWeightHistory();

      set({
        weightHistory: response.data,
      });
    } catch (error: any) {
      console.error(
        "❌ [GoalsStore] Failed to load weight history:",
        error?.response?.data ?? error?.message,
      );
    }
  },

  createGoal: async (userId, title) => {
    try {
      const response = await goalsApi.createGoal(userId, title);

      set((state) => ({
        goals: [response.data, ...state.goals],
      }));

      await get().loadProgress();
    } catch (error: any) {
      console.error(
        "❌ [GoalsStore] Failed to create goal:",
        error?.response?.data ?? error?.message,
      );

      set({
        error: error?.response?.data?.message ?? "Failed to create goal.",
      });

      throw error;
    }
  },

  completeGoal: async (goalId) => {
    try {
      const response = await goalsApi.markGoalCompleted(goalId);

      set((state) => ({
        goals: state.goals.map((goal) =>
          goal._id === goalId
            ? {
                ...goal,
                isCompleted: response.data.updatedGoal.isCompleted,
              }
            : goal,
        ),
      }));

      await get().loadProgress();
    } catch (error: any) {
      console.error(
        "❌ [GoalsStore] Failed to complete goal:",
        error?.response?.data ?? error?.message,
      );

      set({
        error: error?.response?.data?.message ?? "Failed to complete goal.",
      });

      throw error;
    }
  },

  updateGoal: async (goalId, title) => {
    try {
      await goalsApi.updateGoal(goalId, title);

      set((state) => ({
        goals: state.goals.map((goal) =>
          goal._id === goalId
            ? {
                ...goal,
                title,
              }
            : goal,
        ),
      }));
    } catch (error: any) {
      console.error(
        "❌ [GoalsStore] Failed to update goal:",
        error?.response?.data ?? error?.message,
      );

      set({
        error: error?.response?.data?.message ?? "Failed to update goal.",
      });

      throw error;
    }
  },

  deleteGoal: async (goalId) => {
    try {
      await goalsApi.deleteGoal(goalId);

      set((state) => ({
        goals: state.goals.filter((goal) => goal._id !== goalId),
      }));

      await get().loadProgress();
    } catch (error: any) {
      console.error(
        "❌ [GoalsStore] Failed to delete goal:",
        error?.response?.data ?? error?.message,
      );

      set({
        error: error?.response?.data?.message ?? "Failed to delete goal.",
      });

      throw error;
    }
  },

  addWeight: async (weight) => {
    try {
      await goalsApi.addWeight(weight);

      await get().loadWeightHistory();
    } catch (error: any) {
      console.error(
        "❌ [GoalsStore] Failed to add weight:",
        error?.response?.data ?? error?.message,
      );

      set({
        error: error?.response?.data?.message ?? "Failed to add weight.",
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
