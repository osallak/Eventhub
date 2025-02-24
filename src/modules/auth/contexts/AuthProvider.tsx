import { ReactNode, useState, useEffect, useMemo } from 'react';
import { AuthContext } from './AuthContext';
import { API_ROUTES } from '@common/defs/api-routes';
import useApi, { ApiOptions, ApiResponse } from '@common/hooks/useApi';
import useSWR from 'swr';
import {
  AuthResponse,
  LoginInput,
  RegisterInput,
  RequestPasswordResetInput,
  ResetPasswordInput,
} from '../types/auth.types';
import { User } from '@modules/users/defs/types';

interface ApiAuthResponse {
  status: string;
  user: User;
  authorization: {
    token: string;
    type: string;
  };
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isChecking, setIsChecking] = useState(true);
  const fetchApi = useApi();

  const getStorageItem = (key: string): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  };

  // Only fetch if we have a token
  const shouldFetch = typeof window !== 'undefined' && !!getStorageItem('token');

  const {
    data: user,
    mutate,
    isValidating,
  } = useSWR<User | null>(shouldFetch ? API_ROUTES.Auth.Me : null, async (url: string) => {
    try {
      const token = getStorageItem('token');
      if (!token) {
        setIsChecking(false);
        return null;
      }

      const response = await fetchApi<ApiAuthResponse>(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.success || !response.data) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
        setIsChecking(false);
        return null;
      }

      setIsChecking(false);
      return response.data.user;
    } catch (error) {
      setIsChecking(false);
      return null;
    }
  });

  useEffect(() => {
    if (!shouldFetch) {
      setIsChecking(false);
    }
  }, [shouldFetch]);

  useEffect(() => {
    if (user) {
      setIsChecking(false);
    }
  }, [user]);

  const isAuthenticated = typeof window !== 'undefined' && !!getStorageItem('token') && !!user;
  const isLoading = isValidating || isChecking;
  const initialized = !isLoading;

  const handleAuthResponse = (response: { data: ApiAuthResponse }): ApiResponse<AuthResponse> => {
    if (response.data.status === 'success' && response.data.authorization?.token) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.authorization.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      mutate(response.data.user, false);

      return {
        success: true,
        status: response.data.status,
        data: {
          status: response.data.status,
          user: response.data.user,
          authorization: response.data.authorization,
        },
        errors: [],
      };
    }
    return {
      success: false,
      status: 'error',
      errors: ['Authentication failed'],
    };
  };

  const login = async (
    input: LoginInput,
    options?: ApiOptions
  ): Promise<ApiResponse<AuthResponse>> => {
    const response = await fetchApi<ApiAuthResponse>(API_ROUTES.Auth.Login, {
      data: input,
      ...options,
      displaySuccess: false,
    });

    if (response.success && response.data) {
      return handleAuthResponse(response);
    }

    return {
      success: false,
      status: 'error',
      errors: response.errors || ['Authentication failed'],
    };
  };

  const register = async (
    input: RegisterInput,
    options?: ApiOptions
  ): Promise<ApiResponse<AuthResponse>> => {
    const response = await fetchApi<ApiAuthResponse>(API_ROUTES.Auth.Register, {
      data: input,
      ...options,
      displaySuccess: false,
    });

    if (response.success && response.data) {
      const authResponse = handleAuthResponse({ data: response.data as ApiAuthResponse });
      await mutate();
      return authResponse;
    }

    return {
      success: false,
      status: 'error',
      errors: response.errors || ['Registration failed'],
    };
  };

  const logout = async (options?: ApiOptions): Promise<ApiResponse<null>> => {
    const response = await fetchApi<null>(API_ROUTES.Auth.Logout, {
      method: 'POST',
      ...options,
    });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    mutate(null);
    return response;
  };

  const requestPasswordReset = async (
    input: RequestPasswordResetInput,
    options?: ApiOptions
  ): Promise<ApiResponse<null>> => {
    return fetchApi<null>(API_ROUTES.Auth.RequestPasswordReset, {
      data: input,
      ...options,
    });
  };

  const resetPassword = async (
    input: ResetPasswordInput,
    options?: ApiOptions
  ): Promise<ApiResponse<AuthResponse>> => {
    const response = await fetchApi<ApiAuthResponse>(API_ROUTES.Auth.ResetPassword, {
      data: input,
      ...options,
    });

    if (response.success && response.data) {
      return handleAuthResponse({ data: response.data as ApiAuthResponse });
    }

    return {
      success: false,
      status: 'error',
      errors: response.errors || ['Password reset failed'],
    };
  };

  // Fix the value with useMemo to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      user: user || null,
      login,
      register,
      logout,
      requestPasswordReset,
      resetPassword,
      initialized,
      isAuthenticated,
      isLoading,
    }),
    [user, initialized, isAuthenticated, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
