import { API_ROUTES } from '@common/defs/api-routes';
import useApi, { ApiOptions, ApiResponse } from '@common/hooks/useApi';
import { User } from '@modules/users/defs/types';
import { useState } from 'react';
import useSWR from 'swr';
import {
  AuthResponse,
  LoginInput,
  RegisterInput,
  RequestPasswordResetInput,
  ResetPasswordInput,
} from '@modules/auth/types/auth.types';

interface ApiAuthResponse {
  status: string;
  user: User;
  authorization: {
    token: string;
    type: string;
  };
}

interface AuthData {
  user: User | null;
  login: (credentials: LoginInput, options?: ApiOptions) => Promise<ApiResponse<AuthResponse>>;
  register: (
    credentials: RegisterInput,
    options?: ApiOptions
  ) => Promise<ApiResponse<AuthResponse>>;
  logout: (_options?: ApiOptions) => Promise<ApiResponse<null>>;
  requestPasswordReset: (
    _input: RequestPasswordResetInput,
    _options?: ApiOptions
  ) => Promise<ApiResponse<null>>;
  resetPassword: (
    _input: ResetPasswordInput,
    _options?: ApiOptions
  ) => Promise<ApiResponse<AuthResponse>>;
  initialized: boolean; // This is used to prevent the app from rendering before the useAuth initial fetch is complete
  isAuthenticated: boolean;
  isLoading: boolean;
}

const useAuth = (): AuthData => {
  const authEnabled = process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true';
  const [isChecking, setIsChecking] = useState(true);
  const fetchApi = useApi();

  const getStorageItem = (key: string): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  };

  const handleAuthResponse = (response: ApiAuthResponse) => {
    if (response.status === 'success' && response.authorization?.token) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', response.authorization.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      mutate();
      return {
        success: true,
        status: response.status,
        data: response,
        errors: [],
      };
    }

    return {
      success: false,
      status: 'error',
      errors: ['Authentication failed'],
    };
  };

  const {
    data: user,
    mutate,
    isValidating,
  } = useSWR(
    API_ROUTES.Auth.Me,
    async (url) => {
      try {
        const token = getStorageItem('authToken');
        console.log('useAuth: Fetching user data', {
          hasToken: !!token,
          url,
          token,
        });

        if (!token) {
          setIsChecking(false);
          return null;
        }

        const response = await fetchApi<ApiAuthResponse>(url, { method: 'GET' });
        console.log('useAuth: API response', {
          success: response.success,
          hasUser: !!response.data?.user,
          userData: response.data,
        });

        if (!response.success) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
          }
        }

        setIsChecking(false);
        return response.success ? response.data?.user : null;
      } catch (error) {
        console.error('useAuth: Error fetching user', error);
        setIsChecking(false);
        return null;
      }
    },
    {
      revalidateOnFocus: true,
      shouldRetryOnError: true,
      dedupingInterval: 5000,
    }
  );

  const isAuthenticated = typeof window !== 'undefined' && !!getStorageItem('authToken') && !!user;
  const isLoading = isValidating || isChecking;

  if (!authEnabled) {
    return {
      user: null,
      initialized: true,
      isAuthenticated: false,
      isLoading: false,
      login: async () => ({
        success: false,
        status: 'error',
        errors: ['Auth is disabled'],
      }),
      register: async () => ({
        success: false,
        status: 'error',
        errors: ['Auth is disabled'],
      }),
      logout: async () => ({
        success: false,
        status: 'error',
        errors: ['Auth is disabled'],
      }),
      requestPasswordReset: async () => ({
        success: false,
        status: 'error',
        errors: ['Auth is disabled'],
      }),
      resetPassword: async () => ({
        success: false,
        status: 'error',
        errors: ['Auth is disabled'],
      }),
    };
  }

  const login = async (input: LoginInput, options?: ApiOptions) => {
    const response = await fetchApi<ApiAuthResponse>(API_ROUTES.Auth.Login, {
      data: input,
      ...options,
      displaySuccess: false,
    });

    if (response.success && response.data) {
      // response.data is now the ApiAuthResponse
      return handleAuthResponse(response.data);
    }

    return {
      success: false,
      status: 'error',
      errors: response.errors || ['Authentication failed'],
    };
  };

  const register = async (input: RegisterInput, options?: ApiOptions) => {
    const response = await fetchApi<ApiAuthResponse>(API_ROUTES.Auth.Register, {
      data: input,
      ...options,
      displaySuccess: false,
    });

    if (response.success && response.data) {
      // Handle successful registration same as login
      const authResponse = handleAuthResponse(response.data);
      // Trigger an immediate revalidation after registration
      await mutate();
      return authResponse;
    }

    return {
      success: false,
      status: 'error',
      errors: response.errors || ['Registration failed'],
    };
  };

  const logout = async (options?: ApiOptions) => {
    const response = await fetchApi<null>(API_ROUTES.Auth.Logout, {
      method: 'POST',
      ...options,
    });
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    mutate();
    return response;
  };

  const requestPasswordReset = async (input: RequestPasswordResetInput, options?: ApiOptions) => {
    const response = await fetchApi<null>(API_ROUTES.Auth.RequestPasswordReset, {
      data: input,
      ...options,
    });
    return response;
  };

  const resetPassword = async (input: ResetPasswordInput, options?: ApiOptions) => {
    const response = await fetchApi<ApiAuthResponse>(API_ROUTES.Auth.ResetPassword, {
      data: input,
      ...options,
    });

    if (response.success && response.data) {
      return handleAuthResponse(response.data);
    }

    return {
      success: false,
      status: 'error',
      errors: response.errors || ['Password reset failed'],
    };
  };

  return {
    user: user ?? null,
    login,
    register,
    logout,
    requestPasswordReset,
    resetPassword,
    initialized: !isLoading,
    isAuthenticated,
    isLoading,
  };
};

export default useAuth;
