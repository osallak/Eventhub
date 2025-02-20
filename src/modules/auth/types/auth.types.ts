import { ApiResponse, FetchApiOptions } from '@common/hooks/useApi';
import { User } from '@modules/users/defs/types';

export enum AUTH_MODE {
  LOGGED_IN = 'LOGGED_IN',
  LOGGED_OUT = 'LOGGED_OUT',
  PUBLIC = 'PUBLIC',
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthData {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  initialized: boolean;
  login: (
    credentials: LoginCredentials,
    options?: FetchApiOptions
  ) => Promise<ApiResponse<AuthResponse>>;
  register: (
    credentials: RegisterCredentials,
    options?: FetchApiOptions
  ) => Promise<ApiResponse<AuthResponse>>;
  logout: () => Promise<ApiResponse<null>>;
  requestPasswordReset: (data: PasswordResetRequest) => Promise<ApiResponse<null>>;
  resetPassword: (data: PasswordReset) => Promise<ApiResponse<AuthResponse>>;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  status: string;
  user: User;
  authorization: {
    token: string;
    type: string;
  };
}

export interface GoogleAuthResponse {
  token: string;
  user: User;
}

export interface WithAuthOptions {
  mode: AUTH_MODE;
  redirectUrl: string;
  adminOnly?: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
  remember?: boolean;
}

export interface LoginInput {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface RequestPasswordResetInput {
  email: string;
}

export interface ResetPasswordInput {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
}
