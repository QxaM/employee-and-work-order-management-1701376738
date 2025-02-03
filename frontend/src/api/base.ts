import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient();

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string;
