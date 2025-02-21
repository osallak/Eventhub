import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  AuthState,
  LoginCredentials,
  PasswordReset,
  PasswordResetRequest,
  RegisterCredentials,
  ApiResponse,
  AuthResponse,
} from '../types/auth.types';

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<ApiResponse<AuthResponse>>;
  register: (credentials: RegisterCredentials) => Promise<ApiResponse<AuthResponse>>;
  logout: () => Promise<ApiResponse<null>>;
  requestPasswordReset: (data: PasswordResetRequest) => Promise<ApiResponse<null>>;
  resetPassword: (data: PasswordReset) => Promise<ApiResponse<AuthResponse>>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setState((prev) => ({ ...prev, isLoading: false }));
          return;
        }

        // TODO: Implement token validation and user fetch
        setState((prev) => ({ ...prev, isLoading: false }));
      } catch (error) {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
      setState((prev) => ({ ...prev, isLoading: true }));
      try {
        return {
          success: false,
          status: 'error',
          errors: ['Not implemented'],
        };
      } finally {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    []
  );

  const register = async (credentials: RegisterCredentials): Promise<ApiResponse<AuthResponse>> => {
    return {
      success: false,
      status: 'error',
      errors: ['Not implemented'],
    };
  };

  const logout = async (): Promise<ApiResponse<null>> => {
    return {
      success: false,
      status: 'error',
      errors: ['Not implemented'],
    };
  };

  const requestPasswordReset = async (data: PasswordResetRequest): Promise<ApiResponse<null>> => {
    return {
      success: false,
      status: 'error',
      errors: ['Not implemented'],
    };
  };

  const resetPassword = async (data: PasswordReset): Promise<ApiResponse<AuthResponse>> => {
    return {
      success: false,
      status: 'error',
      errors: ['Not implemented'],
    };
  };

  const value = useMemo(
    () => ({
      ...state,
      login,
      register,
      logout,
      requestPasswordReset,
      resetPassword,
    }),
    [state, login, register, logout, requestPasswordReset, resetPassword]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
