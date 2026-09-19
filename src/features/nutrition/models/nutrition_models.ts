export interface Meal {
  _id?: string;
  id?: string;
  user?: string;
  name: string;
  mealType: string;
  calorie: number;
  protein: number;
  carb: number;
  fat: number;
  image?: string;
  prepTime?: string;
  ingredients?: string[];
  instructions?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MealMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface GetMealsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: MealMeta;
  data: Meal[];
}

export interface AteMealData {
  _id?: string;
  user?: string;
  calorieGoal: number;
  consumedCalorie: number;
  consumedProtein: number;
  consumedCarb: number;
  consumedFat: number;
  percentage: number;
}

export interface AteMealResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: AteMealData;
}
