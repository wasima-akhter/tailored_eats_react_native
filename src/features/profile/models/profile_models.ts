export interface Profile {
  _id?: string;
  id?: string;

  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;

  age?: number;
  gender?: string;
  height?: number;
  weight?: number;

  activityLevel?: string;
  foodVibe?: string;
  mainGoal?: string;
  result?: string;
  training?: string;

  image?: string;
  profile_image?: string;

  subscriptionPlan?: string | null;
  isTwoFactor?: boolean;

  [key: string]: unknown;
}

export interface ProfileResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Profile;
}

export interface UpdateProfileResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Profile;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  age?: number;
  gender?: string;
  height?: number;
  activityLevel?: string;
  foodVibe?: string;
  mainGoal?: string;
  result?: string;
  training?: string;
}
