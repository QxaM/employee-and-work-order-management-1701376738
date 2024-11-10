import { useMutation } from '@tanstack/react-query';

import { apiBaseUrl } from '@/api/base.ts';
import { RegisterType } from '@/types/AuthorizationTypes.ts';
import { ApiErrorType } from '@/types/ApiTypes.ts';

const REGISTER_API = '/register';

interface RegistrationRequest {
  data: RegisterType;
  signal?: AbortSignal;
}

export const register = async ({
  data,
  signal,
}: RegistrationRequest): Promise<void> => {
  const url = apiBaseUrl + REGISTER_API;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    signal,
  });

  if (!response.ok) {
    let message = 'Unknown error during registration process!';

    try {
      const errorData = (await response.json()) as ApiErrorType;
      if (errorData.message) {
        message = errorData.message;
      }
    } catch {
      // JSON parse error or missing message - use default error message
    }
    throw new Error(message);
  }
};

export const useRegisterUser = () => {
  return useMutation({
    mutationKey: ['register'],
    mutationFn: ({ data, signal }: RegistrationRequest) =>
      register({ data, signal }),
  });
};
