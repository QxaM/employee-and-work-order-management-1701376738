import { useMutation } from '@tanstack/react-query';

import { apiBaseUrl, handleFetch } from './base.ts';
import { LoginType, TokenType } from '../types/AuthorizationTypes.ts';

const LOGIN_API = '/login';

/**
 * Request payload for the login API.
 */
export interface LoginRequest {
  data: LoginType;
  signal?: AbortSignal;
}

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

export const useLoginUser = () => {
  return useMutation({
    mutationKey: ['login'],
    mutationFn: ({ data, signal }: LoginRequest) => login({ data, signal }),
  });
};
