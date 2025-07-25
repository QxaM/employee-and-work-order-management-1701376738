import { useMutation } from '@tanstack/react-query';

import { apiBaseUrl, handleFetch } from './base.ts';
import { LoginType, TokenType } from '../types/AuthorizationTypes.ts';

const VERIFICATION_API = '/register/confirm';
const LOGIN_API = '/login';

/**
 * Request payload for the register/confirm API.
 */
export interface ConfirmRequest {
  token: string;
  signal?: AbortSignal;
}

/**
 * Request payload for the login API.
 */
export interface LoginRequest {
  data: LoginType;
  signal?: AbortSignal;
}

/**
 * Handles user verification by sending a POST request to Authorization Service
 * /register/confirm API
 * Throws an error with a message if the verification fails or token was expired.
 *
 * @param {ConfirmRequest} param0 - Registration payload and optional AbortSignal.
 * @returns {Promise<void>} - Resolves when registration succeeds.
 * @throws {Error} - throws Error when registration fails
 */
export const confirmRegistration = async ({
  token,
  signal,
}: ConfirmRequest): Promise<void> => {
  const url = apiBaseUrl + VERIFICATION_API + `?token=${token}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    let message = 'Error during verification process, try again later';

    if (response.status === 422) {
      message = 'Token is expired - sent a new one';
    }

    throw new Error(message);
  }
};

/**
 * Handles user login by sending a POST request, including a basic authentication header.
 * Uses Authorization Service /login request.
 * Throws an error with a message if the login fails.
 *
 * @param {LoginRequest} param0 - Login payload and optional AbortSignal.
 * @returns {Promise<TokenType>} - Resolves with the authentication token when login succeeds.
 * @throws {Error} - Throws Error when login fails
 */
export const login = async ({
  data,
  signal,
}: LoginRequest): Promise<TokenType> => {
  const url = apiBaseUrl + LOGIN_API;
  const defaultErrorMessage = 'Unknown error during login process!';

  return await handleFetch<TokenType>(
    url,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa(data.email + ':' + data.password),
      },
      signal,
    },
    defaultErrorMessage
  );
};

export const useConfirmRegistration = () => {
  return useMutation({
    mutationKey: ['registrationVerification'],
    mutationFn: ({ token, signal }: ConfirmRequest) =>
      confirmRegistration({ token, signal }),
  });
};

export const useLoginUser = () => {
  return useMutation({
    mutationKey: ['login'],
    mutationFn: ({ data, signal }: LoginRequest) => login({ data, signal }),
  });
};
