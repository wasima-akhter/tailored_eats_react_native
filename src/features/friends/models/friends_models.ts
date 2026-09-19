export interface Friend {
  _id?: string;
  userId?: string;
  friendId?: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  gender?: string;
  age?: number;
  height?: number;
  activityLevel?: string;
  foodVibe?: string;
  mainGoal?: string;
  result?: string;
  training?: string;
  image?: string;
  profile_image?: string;
  percentage?: number;
  createdAt?: string;
}

export interface FriendRequest {
  senderId: string;
  name: string;
  mainGoal?: string;
  image?: string;
  createdAt?: string;
}

export interface FriendMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface FriendSuggestionsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: FriendMeta;
  data: Friend[];
}

export interface FriendsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Friend[];
}

export interface FriendRequestsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: FriendRequest[];
}

export interface FriendActionResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    _id?: string;
    sender?: string;
    receiver?: string;
    status?: string;
  };
}
