import { apiBaseUrl } from './base.ts';
import { useMutation } from '@tanstack/react-query';

const PASSWORD_RESET_API = '/password/reset';

/**
 * Request payload for the password request API.
 */
export interface PasswordResetRequest {
  email: string;
  signal?: AbortSignal;
}

/**
 * Handles password reset request by sending a POST request to Authorization Service
 * /password/reset API
 *
 * @param {PasswordResetRequest} param0 - Registration payload and optional AbortSignal.
 * @returns {Promise<void>} - Resolves when reset request succeeds.
 * @throws {Error} - Throws Error during API errors with generic response to hide implementation.
 */
export const requestPasswordReset = async ({
  email,
  signal,
}: PasswordResetRequest): Promise<void> => {
  const url = apiBaseUrl + PASSWORD_RESET_API + `?email=${email}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    throw new Error('Error requesting password reset, try again later');
  }
};

export const useResetRequest = () => {
  return useMutation({
    mutationKey: ['requestPasswordReset'],
    mutationFn: ({ email, signal }: PasswordResetRequest) =>
      requestPasswordReset({ email, signal }),
  });
};
