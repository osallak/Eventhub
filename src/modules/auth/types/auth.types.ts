export enum AUTH_MODE {
  LOGGED_IN = 'LOGGED_IN',
  LOGGED_OUT = 'LOGGED_OUT',
  PUBLIC = 'PUBLIC',
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
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
  username?: string;
  first_name?: string;
  last_name?: string;
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
  message?: string;
  user: {
    id: number;
    name: string;
    email: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    created_at: string;
  };
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
