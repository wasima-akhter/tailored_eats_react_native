import { create } from "zustand";

import { secureStorage } from "../../../core/storage/secure_storage";
import { authApi } from "../api/auth_api";
import { userApi } from "../api/user_api";
import { AuthUser } from "../models/auth_models";

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  isHydrating: boolean;

  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => Promise<void>;

  sendEmailOtp: (email: string) => Promise<void>;

  checkEmailOtp: (email: string, otp: string) => Promise<void>;

  forgotPassword: (email: string) => Promise<void>;

  checkForgotPasswordOtp: (email: string, otp: string) => Promise<string>;

  resetPassword: (
    token: string,
    newPassword: string,
    confirmPassword: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isLoading: false,
  isHydrating: true,

  initialize: async () => {
    console.log("🔄 [AuthStore] Initializing session...");

    try {
      const token = await secureStorage.getAccessToken();

      console.log("🔑 [AuthStore] Stored token:", Boolean(token));

      if (!token) {
        set({
          accessToken: null,
          user: null,
          isHydrating: false,
        });

        console.log("👤 [AuthStore] No stored session");
        return;
      }

      set({
        accessToken: token,
      });

      console.log("🌐 [AuthStore] Fetching current user...");

      const response = await userApi.getUserDetail();

      console.log("✅ [AuthStore] Session restored:", response.data);

      set({
        accessToken: token,
        user: response.data,
        isHydrating: false,
      });
    } catch (error: any) {
      console.error(
        "❌ [AuthStore] Session restoration failed:",
        error?.response?.data ?? error?.message,
      );

      await secureStorage.removeAccessToken();

      set({
        accessToken: null,
        user: null,
        isHydrating: false,
      });
    }
  },

  login: async (email, password) => {
    console.log("🔐 [AuthStore] Login started");
    console.log("📧 [AuthStore] Email:", email);

    set({ isLoading: true });

    try {
      const response = await authApi.login({
        email,
        password,
      });

      console.log("✅ [AuthStore] Login API successful");
      console.log("👤 [AuthStore] User:", response.data.user);
      console.log(
        "🔑 [AuthStore] Token received:",
        Boolean(response.data.accessToken),
      );

      await secureStorage.saveAccessToken(response.data.accessToken);

      set({
        accessToken: response.data.accessToken,
        user: response.data.user,
        isLoading: false,
      });

      console.log("🎉 [AuthStore] Login completed");
    } catch (error) {
      set({ isLoading: false });

      console.error("❌ [AuthStore] Login failed");

      throw error;
    }
  },

  register: async (name, email, password, confirmPassword) => {
    set({ isLoading: true });

    try {
      const response = await authApi.register({
        name,
        email,
        password,
        confirmPassword,
      });

      await secureStorage.saveAccessToken(response.data.accessToken);

      set({
        accessToken: response.data.accessToken,
        user: response.data.user,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  sendEmailOtp: async (email) => {
    await authApi.sendEmailOtp(email);
  },

  checkEmailOtp: async (email, otp) => {
    await authApi.checkEmailOtp(email, otp);
  },

  forgotPassword: async (email) => {
    await authApi.forgotPassword(email);
  },

  checkForgotPasswordOtp: async (email, otp) => {
    const response = await authApi.checkForgotPasswordOtp(email, otp);

    return response.data.activationToken;
  },

  resetPassword: async (token, newPassword, confirmPassword) => {
    await authApi.resetPassword(token, newPassword, confirmPassword);
  },
  logout: async () => {
    console.log("🚪 [AuthStore] Logging out...");

    await secureStorage.removeAccessToken();

    set({
      accessToken: null,
      user: null,
    });

    console.log("✅ [AuthStore] Logout completed");
  },
}));
