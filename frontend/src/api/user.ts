import { ApiErrorType } from '../types/ApiTypes.ts';
import { GetUsersType } from '../types/UserTypes.ts';
import { apiBaseUrl } from './base.ts';

export interface GetUsersRequest {
  page?: number;
  size?: number;
  signal?: AbortSignal;
}

const USERS_API = '/users';

export const getUsers = async ({
  page = 0,
  size = 50,
  signal,
}: GetUsersRequest) => {
  const url = apiBaseUrl + USERS_API + `?page=${page}&size=${size}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    signal,
  });

  if (!response.ok) {
    let error = 'Unknown error while fetching user data';

    try {
      const errorData = (await response.json()) as ApiErrorType;
      if (errorData.message) {
        error = errorData.message;
      }
    } catch (error) {
      console.warn(error);
    }

    throw new Error(error);
  }

  return (await response.json()) as GetUsersType;
};
