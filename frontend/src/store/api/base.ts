import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { ApiErrorType } from '../../types/api/BaseTypes.ts';

/**
 * Base URL for API calls, sourced from .env variables. Different for different environments
 * (QA, PROD)
 *
 * @example
 * const url = apiBaseUrl + '/endpoint';
 */
export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string;

export const authApi = '/auth';

/**
 * A default error message used to indicate an unknown error occurred
 * during an API request. This message serves as a fallback for cases
 * where a more specific error message is not available.
 */
const defaultApiError = 'Unknown API request error';

export interface ExtendedFetchArgs extends FetchArgs {
  defaultError?: string;
}

export interface CustomFetchBaseQueryError {
  status: FetchBaseQueryError['status'];
  message: string;
}

const baseQuery = fetchBaseQuery({
  baseUrl: apiBaseUrl + '/api',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const customBaseQuery: BaseQueryFn<
  ExtendedFetchArgs,
  unknown,
  CustomFetchBaseQueryError
> = async (args, api, extraOptions) => {
  const response = await baseQuery(args, api, extraOptions);

  if (response.error) {
    let errorMessage = args.defaultError ?? defaultApiError;

    const error = response.error;
    try {
      const errorData = error.data as ApiErrorType;
      if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch (error) {
      console.warn(error);
    }

    return {
      error: {
        status: error.status,
        message: errorMessage,
      },
    };
  }

  return {
    data: response.data,
    meta: response.meta,
  };
};
