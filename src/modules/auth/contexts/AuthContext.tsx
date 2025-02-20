import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  AuthState,
  LoginCredentials,
  PasswordReset,
  PasswordResetRequest,
  RegisterCredentials,
} from '../types/auth.types';

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (data: PasswordResetRequest) => Promise<void>;
  resetPassword: (data: PasswordReset) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

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

  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      // Login logic here
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const register = async (credentials: RegisterCredentials): Promise<void> => {
    // TODO: Implement register logic
  };

  const logout = async (): Promise<void> => {
    // TODO: Implement logout logic
  };

  const requestPasswordReset = async (data: PasswordResetRequest): Promise<void> => {
    // TODO: Implement password reset request logic
  };

  const resetPassword = async (data: PasswordReset): Promise<void> => {
    // TODO: Implement password reset logic
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
