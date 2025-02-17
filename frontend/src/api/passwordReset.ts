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
 * Request payload for the password update API.
 */
export interface PasswordUpdateRequest {
  token: string;
  password: string;
  signal?: AbortSignal;
}

/**
 * Handles password reset request by sending a POST request to Authorization Service
 * /password/reset API
 *
 * @param {PasswordResetRequest} param0 - Password Reset Request payload and optional AbortSignal.
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

/**
 * Handles password update request by sending a PATCH request to Authorization Service
 * /password/reset API
 *
 * @param {PasswordUpdateRequest} param0 - Password update payload and optional AbortSignal.
 * @returns {Promise<void>} - Resolves when reset request succeeds.
 * @throws {Error} - Throws Error during API errors with generic response to hide implementation.
 */
export const passwordUpdate = async ({
  token,
  password,
  signal,
}: PasswordUpdateRequest): Promise<void> => {
  const encodedPassword = btoa(password);
  const url =
    apiBaseUrl +
    PASSWORD_RESET_API +
    `?token=${token}&password=${encodedPassword}`;

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    let message = 'Error during verification process, try again later';

    if (response.status === 422) {
      message = 'Token expired, try new password reset request';
    }

    throw new Error(message);
  }
};

export const useResetRequest = () => {
  return useMutation({
    mutationKey: ['requestPasswordReset'],
    mutationFn: ({ email, signal }: PasswordResetRequest) =>
      requestPasswordReset({ email, signal }),
  });
};

export const usePasswordUpdate = () => {
  return useMutation({
    mutationKey: ['passwordUpdate'],
    mutationFn: ({ token, password, signal }: PasswordUpdateRequest) =>
      passwordUpdate({ token, password, signal }),
  });
};
