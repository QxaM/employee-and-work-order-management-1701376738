import { useMutation } from '@tanstack/react-query';

import { apiBaseUrl } from '../api/base.ts';
import {
  LoginType,
  RegisterType,
  TokenType,
} from '../types/AuthorizationTypes.ts';
import { ApiErrorType } from '../types/ApiTypes.ts';

const REGISTER_API = '/register';
const LOGIN_API = '/login';

export interface RegisterRequest {
  data: RegisterType;
  signal?: AbortSignal;
}

export interface LoginRequest {
  data: LoginType;
  signal?: AbortSignal;
}

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

export const useLoginUser = () => {
  return useMutation({
    mutationKey: ['login'],
    mutationFn: ({ data, signal }: LoginRequest) => login({ data, signal }),
  });
};
