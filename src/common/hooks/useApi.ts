import { Any } from '@common/defs/types';
import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
import useFetch from '@common/hooks/useFetch';
import { useTranslation } from 'react-i18next';

// Generic REST API response format
interface ApiResponseData<T = unknown> {
  status: 'success' | 'error';
  message?: string;
  errors?: Record<string, string[]> | string[];
  data?: T;
  [key: string]: unknown; // Allow for additional properties
}

// Our internal normalized response format
export interface NormalizedResponse<T> {
  success: boolean;
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
  const { makeFetch } = useFetch<ApiResponseData<Any>>();
  const { t, i18n } = useTranslation(['common']);

  const fetchApi = useCallback(
    async <T>(endpoint: string, options?: ApiOptions): Promise<NormalizedResponse<T>> => {
      const authToken = localStorage.getItem('authToken');
      const headers: Headers = new Headers();
      headers.set('Accept', 'application/json');
      if (!(options?.data instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
      }
      headers.set('Accept-Language', i18n.language);
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
      const verbose = options?.verbose ?? false;
      if (verbose) {
        console.log(`useApi: requesting ${url}`, options);
      }

      const requestOptions = {
        method,
        headers,
        data: options?.data,
      };

      const response = await makeFetch(url, {
        verbose,
        displayProgress: options?.displayProgress,
        request: requestOptions,
      });

      console.log('response', response);

      if (verbose) {
        console.log(`useApi: response`, response);
      }

      // Handle API response
      if (response) {
        // If it's a success response
        if (response.status === 'success') {
          const displaySuccess = options?.displaySuccess ?? false;
          if (displaySuccess && response.message) {
            enqueueSnackbar(response.message, { variant: 'success' });
          }
          return {
            success: true,
            data: response as unknown as T,
            message: response.message,
          };
        }

        // If it's a error response
        if (response.errors) {
          const errors = Array.isArray(response.errors)
            ? response.errors
            : (Object.values(response.errors).flat() as string[]);

          errors.forEach((error: string) => {
            enqueueSnackbar(error, { variant: 'error' });
          });
          return {
            success: false,
            errors,
          };
        }
      }

      // Handle non-API responses or other errors
      const errorMessage = t('common:error_occurred');
      enqueueSnackbar(errorMessage, { variant: 'error' });
      return { success: false, errors: [errorMessage] };
    },
    [enqueueSnackbar, makeFetch, t, i18n.language]
  );

  return fetchApi;
};

export default useApi;
