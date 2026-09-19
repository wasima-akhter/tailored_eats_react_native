/////

export interface CalorieData {
  _id?: string;
  user?: string;
  consumedCalorie?: number;
  calorieGoal?: number;
  percentage?: number;
  proteinGoal?: number;
  fatGoal?: number;
  carbGoal?: number;
  consumedProtein?: number;
  consumedFat?: number;
  consumedCarb?: number;
  completedGoal?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface WeightData {
  _id?: string;
  user?: string;
  weightKg?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserDetail {
  _id?: string;
  id?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;

  activityLevel?: string;
  age?: number;
  gender?: string;
  foodVibe?: string;
  mainGoal?: string;
  goal?: string;
  result?: string;
  training?: string;
  height?: number;

  image?: string;
  profile_image?: string;

  calorie?: CalorieData;
  weight?: WeightData[];

  [key: string]: unknown;
}

export interface UserDetailResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: UserDetail;
}

export interface ConsistencyData {
  todayCompleted?: {
    percentage?: number;
  };

  consistency?: Array<{
    completed?: number;
    createdAt?: string;
  }>;

  friendsData?: Array<{
    userId?: string;
    name?: string;
    percentage?: number;
    image?: string;
  }>;
}

export interface ConsistencyResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: ConsistencyData;
}
