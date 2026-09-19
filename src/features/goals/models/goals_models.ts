export interface Goal {
  _id: string;
  title: string;
  isCompleted: boolean;
  createdAt?: string;
}

export interface GetGoalsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Goal[];
}

export interface CreateGoalResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Goal;
}

export interface MarkGoalCompletedData {
  completedPercentage: number;
  updatedGoal: {
    _id: string;
    isCompleted: boolean;
  };
}

export interface MarkGoalCompletedResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: MarkGoalCompletedData;
}

export interface CompletedGoalPercentage {
  totalGoals: number;
  completedGoals: number;
  percentage: number;
}

export interface CompletedGoalPercentageResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: CompletedGoalPercentage;
}

export interface ChangeGoalTypeResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    mainGoal: string;
  };
}

export interface WeightLog {
  _id: string;
  weight: number;
  createdAt: string;
}

export interface WeightHistoryResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: WeightLog[];
}
