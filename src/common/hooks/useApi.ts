import { Any } from '@common/defs/types';
import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
import useFetch from '@common/hooks/useFetch';

export interface ApiResponse<T> {
  success: boolean;
  status: string;
  message?: string;
  errors?: string[];
  data?: T;
}

export interface FetchApiOptions {
  verbose?: boolean;
  displaySuccess?: boolean;
  displayProgress?: boolean;
}

export interface ApiOptions extends FetchApiOptions {
  headers?: HeadersInit;
  data?: Any;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
}

const useApi = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { makeFetch } = useFetch<ApiResponse<Any>>();

  const fetchApi = useCallback(
    async <T>(endpoint: string, options?: ApiOptions): Promise<ApiResponse<T>> => {
      const authToken = localStorage.getItem('authToken');
      const headers: Headers = new Headers();
      headers.set('Accept', 'application/json');
      if (!(options?.data instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
      }
      if (authToken) {
        headers.set('Authorization', `Bearer ${authToken}`);
      }
      if (options?.headers) {
        Object.entries(options.headers).forEach(([key, value]) => {
          headers.set(key, value as string);
        });
      }

      const method = options?.method ?? (options?.data ? 'POST' : 'GET');
      const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;

      const requestOptions = {
        method,
        headers,
        data: options?.data,
      };

      const response = await makeFetch(url, {
        verbose: true,
        displayProgress: options?.displayProgress,
        request: requestOptions,
      });

      if (!response) {
        return {
          success: false,
          status: 'error',
          errors: ['Request failed'],
        };
      }

      const apiResponse: ApiResponse<T> = {
        success: response.status === 'success',
        status: response.status,
        data: response as T,
        errors: [],
      };

      const displaySuccess = options?.displaySuccess ?? false;
      if (!apiResponse.success) {
        if (apiResponse.errors?.length) {
          apiResponse.errors.forEach((error) => {
            enqueueSnackbar(error, { variant: 'error' });
          });
        }
      } else if (displaySuccess && apiResponse.message) {
        enqueueSnackbar(apiResponse.message, { variant: 'success' });
      }

      return apiResponse;
    },
    [enqueueSnackbar, makeFetch]
  );

  return fetchApi;
};

export default useApi;
