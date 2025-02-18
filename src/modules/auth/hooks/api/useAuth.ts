import ApiRoutes from '@common/defs/api-routes';
import useApi, { FetchApiOptions, NormalizedResponse } from '@common/hooks/useApi';
import { User } from '@modules/users/defs/types';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';

export interface LoginInput {
  email: string;
  password: string;
  admin?: boolean;
}

export interface RegisterInput {
  email: string;
  password: string;
}

export interface RequestPasswordResetInput {
  email: string;
}

export interface ResetPasswordInput {
  email: string;
  password: string;
  passwordConfirmation: string;
  token: string;
}

interface AuthResponse {
  status: 'success' | 'error';
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    username?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    createdAt: string;
    updatedAt: string;
  };
  authorization: {
    token: string;
    type: string;
  };
}

interface MeResponse {
  status: 'success' | 'error';
  user: {
    id: number;
    name: string;
    email: string;
    username: string | null;
    first_name: string | null;
    last_name: string | null;
    created_at: string;
    updated_at: string;
  };
}

interface AuthData {
  user: User | null;
  login: (
    _input: LoginInput,
    _options?: FetchApiOptions
  ) => Promise<NormalizedResponse<AuthResponse>>;
  register: (
    _input: RegisterInput & {
      name: string;
      password_confirmation: string;
      username?: string;
      first_name?: string;
      last_name?: string;
    },
    _options?: FetchApiOptions
  ) => Promise<NormalizedResponse<AuthResponse>>;
  logout: (_options?: FetchApiOptions) => Promise<NormalizedResponse<null>>;
  requestPasswordReset: (
    _input: RequestPasswordResetInput,
    _options?: FetchApiOptions
  ) => Promise<NormalizedResponse<null>>;
  resetPassword: (
    _input: ResetPasswordInput,
    _options?: FetchApiOptions
  ) => Promise<NormalizedResponse<{ token: string }>>;
  initialized: boolean; // This is used to prevent the app from rendering before the useAuth initial fetch is complete
}

const useAuth = (): AuthData => {
  const authEnabled = process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true';
  if (!authEnabled) {
    return {
      initialized: true,
      user: null,
      login: async () => ({ success: false, errors: ['Auth is disabled'] }),
      register: async () => ({ success: false, errors: ['Auth is disabled'] }),
      logout: async () => ({ success: false, errors: ['Auth is disabled'] }),
      requestPasswordReset: async () => ({ success: false, errors: ['Auth is disabled'] }),
      resetPassword: async () => ({ success: false, errors: ['Auth is disabled'] }),
    };
  }

  const [initialized, setInitialized] = useState<boolean>(false);

  const fetchApi = useApi();

  const { data: user, mutate } = useSWR<User | null>(ApiRoutes.Auth.Me, async (url) => {
    if (!localStorage.getItem('authToken')) {
      setInitialized(true);
      return null;
    }

    try {
      const response = await fetchApi<MeResponse>(url, {
        method: 'GET',
      });

      setInitialized(true);

      if (response.success && response.data?.status === 'success') {
        return {
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          username: response.data.user.username,
          firstName: response.data.user.first_name,
          lastName: response.data.user.last_name,
          createdAt: response.data.user.created_at,
          updatedAt: response.data.user.updated_at,
          rolesNames: [],
          permissionsNames: [],
        };
      }

      localStorage.removeItem('authToken');
      return null;
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('authToken');
      setInitialized(true);
      return null;
    }
  });

  const { t } = useTranslation();

  const login = useCallback(
    async (input: LoginInput, options?: FetchApiOptions) => {
      try {
        const response = await fetchApi<AuthResponse>(ApiRoutes.Auth.Login, {
          method: 'POST',
          data: {
            email: input.email,
            password: input.password,
          },
          ...options,
        });

        if (response.success && response.data?.status === 'success') {
          localStorage.setItem('authToken', response.data.authorization.token);
          mutate();
        }

        return response;
      } catch (error) {
        console.error('Login error:', error);
        return {
          success: false,
          errors: [t('auth.errors.login_failed')],
        };
      }
    },
    [fetchApi, mutate, t]
  );

  const register = useCallback(
    async (
      input: RegisterInput & {
        name: string;
        password_confirmation: string;
        username?: string;
        first_name?: string;
        last_name?: string;
      },
      options?: FetchApiOptions
    ) => {
      try {
        const response = await fetchApi<AuthResponse>(ApiRoutes.Auth.Register, {
          method: 'POST',
          data: input,
          ...options,
        });

        if (response.success && response.data?.status === 'success') {
          localStorage.setItem('authToken', response.data.authorization.token);
          mutate();
        }

        return response;
      } catch (error) {
        console.error('Registration error:', error);
        return {
          success: false,
          errors: [t('auth.errors.register_failed')],
        };
      }
    },
    [fetchApi, mutate, t]
  );

  const logout = async (options?: FetchApiOptions) => {
    const response = await fetchApi<null>(ApiRoutes.Auth.Logout, { method: 'POST', ...options });
    localStorage.removeItem('authToken');
    mutate();
    return response;
  };

  const requestPasswordReset = async (
    input: RequestPasswordResetInput,
    options?: FetchApiOptions
  ) => {
    const response = await fetchApi<null>(ApiRoutes.Auth.RequestPasswordReset, {
      data: input,
      ...options,
    });
    return response;
  };

  const resetPassword = async (input: ResetPasswordInput, options?: FetchApiOptions) => {
    const response = await fetchApi<{ token: string }>(ApiRoutes.Auth.ResetPassword, {
      data: input,
      ...options,
    });
    return response;
  };

  return {
    user: user ?? null,
    login,
    register,
    logout,
    requestPasswordReset,
    resetPassword,
    initialized,
  };
};

export default useAuth;
