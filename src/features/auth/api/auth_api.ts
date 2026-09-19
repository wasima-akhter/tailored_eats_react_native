import { API_ENDPOINTS } from "../../../core/constants/api_endpoints";
import { apiClient } from "../../../core/network/api_client";

import {
  CheckEmailOtpResponse,
  CheckForgotPasswordOtpResponse,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordResponse,
  SendEmailOtpResponse,
} from "../models/auth_models";

export const authApi = {
  async register(request: RegisterRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>(
      API_ENDPOINTS.auth.register,
      request,
    );

    return response.data;
  },

  async login(request: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.auth.login,
      request,
    );

    return response.data;
  },

  async sendEmailOtp(email: string): Promise<SendEmailOtpResponse> {
    const response = await apiClient.post<SendEmailOtpResponse>(
      API_ENDPOINTS.auth.sendEmailOtp,
      {
        email,
      },
    );

    return response.data;
  },

  async checkEmailOtp(
    email: string,
    otp: string,
  ): Promise<CheckEmailOtpResponse> {
    const response = await apiClient.post<CheckEmailOtpResponse>(
      API_ENDPOINTS.auth.checkEmailOtp,
      {
        email,
        otp,
      },
    );

    return response.data;
  },

  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    const response = await apiClient.post<ForgotPasswordResponse>(
      API_ENDPOINTS.auth.forgotPassword,
      {
        email,
      },
    );

    return response.data;
  },

  async checkForgotPasswordOtp(
    email: string,
    otp: string,
  ): Promise<CheckForgotPasswordOtpResponse> {
    const response = await apiClient.post<CheckForgotPasswordOtpResponse>(
      API_ENDPOINTS.auth.checkForgotPasswordOtp,
      {
        email,
        otp,
      },
    );

    return response.data;
  },

  async resetPassword(
    token: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<ResetPasswordResponse> {
    const response = await apiClient.patch<ResetPasswordResponse>(
      API_ENDPOINTS.auth.resetPassword,
      {
        token,
        newPassword,
        confirmPassword,
      },
    );

    return response.data;
  },
};
