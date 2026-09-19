export interface AuthUser {
  id?: string;
  _id?: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginData {
  user: AuthUser;
  accessToken: string;
}

export interface RegisterData {
  user: AuthUser;
  accessToken: string;
}

export interface LoginResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: LoginData;
}

export interface RegisterResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: RegisterData;
}

export interface SendEmailOtpResponse {
  statusCode: number;
  success: boolean;
  message: string;
}

export interface CheckEmailOtpResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    isVerified: boolean;
  };
}

export interface ForgotPasswordResponse {
  statusCode: number;
  success: boolean;
  message: string;
}

export interface CheckForgotPasswordOtpResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    email: string;
    activationToken: string;
  };
}

export interface ResetPasswordResponse {
  statusCode: number;
  success: boolean;
  message: string;
}
