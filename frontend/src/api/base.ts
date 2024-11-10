import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient();

export const apiBaseUrl = import.meta.env.apiBaseUrl as string;
