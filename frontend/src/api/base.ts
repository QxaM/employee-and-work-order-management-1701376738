import {QueryClient} from '@tanstack/react-query';

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
