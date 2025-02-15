import { useMutation } from '@tanstack/react-query';

import { apiBaseUrl } from '../api/base.ts';
import {
  LoginType,
  RegisterType,
  TokenType,
} from '../types/AuthorizationTypes.ts';
import { ApiErrorType } from '../types/ApiTypes.ts';

const REGISTER_API = '/register';
const VERIFICATION_API = '/register/confirm';
const LOGIN_API = '/login';

/**
 * Request payload for the register API.
 */
export interface RegisterRequest {
  data: RegisterType;
  signal?: AbortSignal;
}

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
 * Handles user registration by sending a POST request to Authorization Service
 * /register API
 * Throws an error with a message if the registration fails.
 *
 * @param {RegisterRequest} param0 - Registration payload and optional AbortSignal.
 * @returns {Promise<void>} - Resolves when registration succeeds.
 * @throws {Error} - throws Error when registration fails
 */
export const register = async ({
  data,
  signal,
}: RegisterRequest): Promise<void> => {
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

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(data.email + ':' + data.password),
    },
    signal,
  });

  if (!response.ok) {
    let message = 'Unknown error during login process!';

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

  return (await response.json()) as TokenType;
};

export const useRegisterUser = () => {
  return useMutation({
    mutationKey: ['register'],
    mutationFn: ({ data, signal }: RegisterRequest) =>
      register({ data, signal }),
  });
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
