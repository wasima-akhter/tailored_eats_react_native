import { API_ENDPOINTS } from "../../../core/constants/api_endpoints";
import { apiClient } from "../../../core/network/api_client";

import {
  FriendActionResponse,
  FriendRequestsResponse,
  FriendSuggestionsResponse,
  FriendsResponse,
} from "../models/friends_models";

interface FriendSuggestionsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const friendsApi = {
  async getFriendSuggestions(
    params?: FriendSuggestionsParams,
  ): Promise<FriendSuggestionsResponse> {
    const response = await apiClient.get<FriendSuggestionsResponse>(
      API_ENDPOINTS.friend.getFriendSuggestions,
      {
        params,
      },
    );

    return response.data;
  },

  async addFriend(receiverId: string): Promise<FriendActionResponse> {
    const response = await apiClient.post<FriendActionResponse>(
      API_ENDPOINTS.friend.addFriend,
      {
        receiverId,
      },
    );

    return response.data;
  },

  async searchFriend(searchName: string): Promise<FriendsResponse> {
    const response = await apiClient.get<FriendsResponse>(
      API_ENDPOINTS.friend.searchFriend,
      {
        params: {
          searchName,
        },
      },
    );

    return response.data;
  },

  async getAllFriends(): Promise<FriendsResponse> {
    const response = await apiClient.get<FriendsResponse>(
      API_ENDPOINTS.friend.getAllFriends,
    );

    return response.data;
  },

  async getAllFriendRequests(): Promise<FriendRequestsResponse> {
    const response = await apiClient.get<FriendRequestsResponse>(
      API_ENDPOINTS.friend.getAllFriendRequests,
    );

    return response.data;
  },

  async acceptRequest(friendId: string): Promise<FriendActionResponse> {
    const response = await apiClient.patch<FriendActionResponse>(
      API_ENDPOINTS.friend.acceptRequest,
      {
        friendId,
      },
    );

    return response.data;
  },

  async rejectRequest(friendId: string): Promise<FriendActionResponse> {
    const response = await apiClient.patch<FriendActionResponse>(
      API_ENDPOINTS.friend.rejectRequest,
      {
        friendId,
      },
    );

    return response.data;
  },

  async makeUnfriend(friendId: string): Promise<FriendActionResponse> {
    const response = await apiClient.delete<FriendActionResponse>(
      `${API_ENDPOINTS.friend.makeUnfriend}/${friendId}`,
    );

    return response.data;
  },
};
