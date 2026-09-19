import { API_ENDPOINTS } from "../../../core/constants/api_endpoints";
import { apiClient } from "../../../core/network/api_client";

import {
  ChangeGoalTypeResponse,
  CompletedGoalPercentageResponse,
  CreateGoalResponse,
  GetGoalsResponse,
  MarkGoalCompletedResponse,
  WeightHistoryResponse,
} from "../models/goals_models";

export const goalsApi = {
  async getAllGoals(): Promise<GetGoalsResponse> {
    const response = await apiClient.get<GetGoalsResponse>(
      API_ENDPOINTS.goal.getAllGoals,
    );

    return response.data;
  },

  async createGoal(userId: string, title: string): Promise<CreateGoalResponse> {
    const response = await apiClient.post<CreateGoalResponse>(
      API_ENDPOINTS.goal.createNewGoal,
      {
        userId,
        title,
      },
    );

    return response.data;
  },

  async markGoalCompleted(goalId: string): Promise<MarkGoalCompletedResponse> {
    const response = await apiClient.patch<MarkGoalCompletedResponse>(
      API_ENDPOINTS.goal.markGoalCompleted,
      {
        goalId,
      },
    );

    return response.data;
  },

  async updateGoal(goalId: string, title: string): Promise<void> {
    await apiClient.patch(API_ENDPOINTS.goal.updateGoal, {
      goalId,
      title,
    });
  },

  async deleteGoal(goalId: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.goal.deleteGoal}/${goalId}`);
  },

  async changeGoalType(mainGoal: string): Promise<ChangeGoalTypeResponse> {
    const response = await apiClient.patch<ChangeGoalTypeResponse>(
      API_ENDPOINTS.goal.changeGoalType,
      {
        mainGoal,
      },
    );

    return response.data;
  },

  async getCompletedGoalPercentage(): Promise<CompletedGoalPercentageResponse> {
    const response = await apiClient.get<CompletedGoalPercentageResponse>(
      API_ENDPOINTS.goal.completedGoalPercentage,
    );

    return response.data;
  },

  async getWeightHistory(): Promise<WeightHistoryResponse> {
    const response = await apiClient.get<WeightHistoryResponse>(
      API_ENDPOINTS.consistency.getUserWeight,
    );

    return response.data;
  },

  async addWeight(weight: number): Promise<void> {
    await apiClient.post(API_ENDPOINTS.consistency.addUserWeight, {
      weight,
    });
  },
};
