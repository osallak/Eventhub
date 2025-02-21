import { API_ROUTES } from '@common/defs/api-routes';
import useApi, { ApiOptions, ApiResponse } from '@common/hooks/useApi';
import { User } from '@modules/users/defs/types';
import { useState, useEffect } from 'react';
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
  data: User;
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

  console.log('useAuth hook state:', {
    authEnabled,
    isChecking,
  });

  const getStorageItem = (key: string): string | null => {
    if (typeof window !== 'undefined') {
      const value = localStorage.getItem(key);
      console.log(`Getting storage item ${key}:`, {
        exists: !!value,
        value: value ? value.substring(0, 10) + '...' : null,
      });
      return value;
    }
    return null;
  };

  const handleAuthResponse = (response: ApiAuthResponse): ApiResponse<AuthResponse> => {
    console.log('🔐 Handling auth response:', {
      status: response.status,
      hasToken: !!response.authorization?.token,
      userData: response.data ? 'exists' : 'null',
    });

    if (response.status === 'success' && response.authorization?.token) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.authorization.token);
        localStorage.setItem('user', JSON.stringify(response.data)); // Store user from data field
      }
      // Update SWR cache with user data
      mutate(response.data, false); // Pass user data from data field

      return {
        success: true,
        status: response.status,
        data: {
          status: response.status,
          user: response.data, // Use data field
          authorization: response.authorization,
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

  // Only fetch if we have a token
  const shouldFetch = typeof window !== 'undefined' && !!getStorageItem('token');

  const {
    data: user,
    mutate,
    isValidating,
  } = useSWR<ApiAuthResponse | null>(shouldFetch ? API_ROUTES.Auth.Me : null, async (url) => {
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
      return response; // Return the whole response
    } catch (error) {
      setIsChecking(false);
      return null;
    }
  });

  // Set isChecking to false if we're not fetching
  useEffect(() => {
    if (!shouldFetch) {
      setIsChecking(false);
    }
  }, [shouldFetch]);

  // Also set isChecking to false when user data is available
  useEffect(() => {
    if (user) {
      setIsChecking(false);
    }
  }, [user]);

  const isAuthenticated =
    typeof window !== 'undefined' && !!getStorageItem('token') && !!user?.data;
  const isLoading = isValidating || isChecking;
  const initialized = !isLoading;

  console.log('useAuth hook values:', {
    isAuthenticated,
    isLoading,
    initialized,
    hasUser: !!user,
    isValidating,
    isChecking,
  });

  // Add logging to debug auth state
  useEffect(() => {
    console.log('Auth state changed:', {
      hasToken: !!getStorageItem('token'),
      hasUser: !!user,
      isAuthenticated,
      user,
    });
  }, [user, isAuthenticated]);

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
    localStorage.removeItem('token');
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
    user: user?.data || null, // Extract data from response
    login,
    register,
    logout,
    requestPasswordReset,
    resetPassword,
    initialized,
    isAuthenticated,
    isLoading,
  };
};

export default useAuth;
