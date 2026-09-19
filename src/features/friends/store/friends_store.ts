import { create } from "zustand";

import { friendsApi } from "../api/friends_api";
import { Friend, FriendRequest } from "../models/friends_models";

interface FriendsState {
  suggestions: Friend[];
  friends: Friend[];
  requests: FriendRequest[];
  searchResults: Friend[];

  isLoading: boolean;
  error: string | null;

  loadSuggestions: (page?: number, search?: string) => Promise<void>;

  loadFriends: () => Promise<void>;

  loadRequests: () => Promise<void>;

  searchFriends: (searchName: string) => Promise<void>;

  addFriend: (receiverId: string) => Promise<void>;

  acceptRequest: (friendId: string) => Promise<void>;

  rejectRequest: (friendId: string) => Promise<void>;

  unfriend: (friendId: string) => Promise<void>;

  clearError: () => void;
}

export const useFriendsStore = create<FriendsState>((set, get) => ({
  suggestions: [],
  friends: [],
  requests: [],
  searchResults: [],

  isLoading: false,
  error: null,

  loadSuggestions: async (page = 1, search) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await friendsApi.getFriendSuggestions({
        page,
        limit: 20,
        search,
      });

      set({
        suggestions: response.data,
        isLoading: false,
      });
    } catch (error: any) {
      console.error(
        "❌ [FriendsStore] Failed to load suggestions:",
        error?.response?.data ?? error?.message,
      );

      set({
        isLoading: false,
        error:
          error?.response?.data?.message ??
          "Failed to load friend suggestions.",
      });
    }
  },

  loadFriends: async () => {
    try {
      const response = await friendsApi.getAllFriends();

      set({
        friends: response.data,
      });
    } catch (error: any) {
      console.error(
        "❌ [FriendsStore] Failed to load friends:",
        error?.response?.data ?? error?.message,
      );

      set({
        error: error?.response?.data?.message ?? "Failed to load friends.",
      });
    }
  },

  loadRequests: async () => {
    try {
      const response = await friendsApi.getAllFriendRequests();

      set({
        requests: response.data,
      });
    } catch (error: any) {
      console.error(
        "❌ [FriendsStore] Failed to load requests:",
        error?.response?.data ?? error?.message,
      );

      set({
        error:
          error?.response?.data?.message ?? "Failed to load friend requests.",
      });
    }
  },

  searchFriends: async (searchName) => {
    if (!searchName.trim()) {
      set({
        searchResults: [],
      });
      return;
    }

    try {
      const response = await friendsApi.searchFriend(searchName.trim());

      set({
        searchResults: response.data,
      });
    } catch (error: any) {
      console.error(
        "❌ [FriendsStore] Failed to search friends:",
        error?.response?.data ?? error?.message,
      );

      set({
        error: error?.response?.data?.message ?? "Failed to search friends.",
      });
    }
  },

  addFriend: async (receiverId) => {
    try {
      await friendsApi.addFriend(receiverId);

      set((state) => ({
        suggestions: state.suggestions.filter(
          (friend) => (friend._id ?? friend.userId) !== receiverId,
        ),
        searchResults: state.searchResults.filter(
          (friend) => (friend._id ?? friend.userId) !== receiverId,
        ),
      }));
    } catch (error: any) {
      console.error(
        "❌ [FriendsStore] Failed to add friend:",
        error?.response?.data ?? error?.message,
      );

      set({
        error:
          error?.response?.data?.message ?? "Failed to send friend request.",
      });

      throw error;
    }
  },

  acceptRequest: async (friendId) => {
    try {
      await friendsApi.acceptRequest(friendId);

      set((state) => ({
        requests: state.requests.filter(
          (request) => request.senderId !== friendId,
        ),
      }));

      await get().loadFriends();
    } catch (error: any) {
      console.error(
        "❌ [FriendsStore] Failed to accept request:",
        error?.response?.data ?? error?.message,
      );

      set({
        error:
          error?.response?.data?.message ?? "Failed to accept friend request.",
      });

      throw error;
    }
  },

  rejectRequest: async (friendId) => {
    try {
      await friendsApi.rejectRequest(friendId);

      set((state) => ({
        requests: state.requests.filter(
          (request) => request.senderId !== friendId,
        ),
      }));
    } catch (error: any) {
      console.error(
        "❌ [FriendsStore] Failed to reject request:",
        error?.response?.data ?? error?.message,
      );

      set({
        error:
          error?.response?.data?.message ?? "Failed to reject friend request.",
      });

      throw error;
    }
  },

  unfriend: async (friendId) => {
    try {
      await friendsApi.makeUnfriend(friendId);

      set((state) => ({
        friends: state.friends.filter(
          (friend) => friend.friendId !== friendId && friend._id !== friendId,
        ),
      }));
    } catch (error: any) {
      console.error(
        "❌ [FriendsStore] Failed to unfriend:",
        error?.response?.data ?? error?.message,
      );

      set({
        error: error?.response?.data?.message ?? "Failed to remove friend.",
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
