import { API_ENDPOINTS } from "../../../core/constants/api_endpoints";
import { apiClient } from "../../../core/network/api_client";

import { AteMealResponse, GetMealsResponse } from "../models/nutrition_models";

interface GetMealsParams {
  mealType?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const nutritionApi = {
  async getCustomMeals(params?: GetMealsParams): Promise<GetMealsResponse> {
    const response = await apiClient.get<GetMealsResponse>(
      API_ENDPOINTS.meal.getCustomMeals,
      {
        params,
      },
    );

    return response.data;
  },

  async ateMeal(data: {
    consumedCalorie: number;
    consumedProtein: number;
    consumedCarb: number;
    consumedFat: number;
  }): Promise<AteMealResponse> {
    const response = await apiClient.patch<AteMealResponse>(
      API_ENDPOINTS.meal.ateMeal,
      data,
    );

    return response.data;
  },
};
