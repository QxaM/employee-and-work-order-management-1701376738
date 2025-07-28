import { QueryClient } from '@tanstack/react-query';
import { ApiErrorType } from '../types/ApiTypes.ts';

/**
 * Single instance of the React Query QueryClient for managing server state with React Query.
 */
export const queryClient = new QueryClient();

/**
 * Base URL for API calls, sourced from .env variables. Different for different environments
 * (QA, PROD)
 *
 * @example
 * const url = apiBaseUrl + '/endpoint';
 */
export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string;

/**
 * A default error message used to indicate an unknown error occurred
 * during an API request. This message serves as a fallback for cases
 * where a more specific error message is not available.
 */
const defaultApiError = 'Unknown API request error';

/**
 * Sends an HTTP request to the specified URL and handles the response.
 * Throws an error with a custom message or a default message if the response
 * indicates a failure.
 *
 * @param {string} url - The URL to which the fetch request is sent.
 * @param {RequestInit} [requestInit] - An optional object containing custom settings for the request.
 * @param {string} [error=defaultApiError] - An optional custom error message to be thrown in case of a failure.
 * @returns {Promise<Response>} A promise that resolves to the Response object if the request succeeds.
 * @throws {Error} If the response is not successful and an error message is provided or derived from the response.
 */
const callFetch = async (
  url: string,
  requestInit?: RequestInit,
  error: string = defaultApiError
): Promise<Response> => {
  const response = await fetch(url, requestInit);

  let errorMessage = error;
  if (!response.ok) {
    try {
      const errorData = (await response.json()) as ApiErrorType;
      if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch (error) {
      console.warn(error);
    }

    throw new Error(errorMessage);
  }

  return response;
};

/**
 * An asynchronous function that handles a fetch operation without returning a value.
 *
 * @param {string} url - The URL to be fetched.
 * @param {RequestInit} [requestInit] - Optional configuration options for the fetch request.
 * @param {string} [error] - Optional error message to be used if an error occurs during the fetch call.
 */
export const handleFetchVoid = async (
  url: string,
  requestInit?: RequestInit,
  error?: string
) => {
  await callFetch(url, requestInit, error);
};
