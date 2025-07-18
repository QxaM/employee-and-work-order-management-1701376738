import { apiBaseUrl, handleFetch, handleFetchVoid } from './base.ts';
import { RoleType } from '../types/RoleTypes.ts';
import { GetUsersType } from '../types/UserTypes.ts';

export interface GetUsersRequest {
  page?: number;
  size?: number;
  signal?: AbortSignal;
}

const USERS_API = '/users';

/**
 * Retrieves a list of users from the API.
 *
 * @function getUsers
 * @async
 * @param {Object} options - The options for fetching users.
 * @param {number} [options.page=0] - The page number for pagination (default is 0).
 * @param {number} [options.size=15] - The number of users to fetch per page (default is 15).
 * @param {AbortSignal} [options.signal] - An optional AbortSignal to abort the fetch request.
 * @returns {Promise<GetUsersType>} A promise that resolves to the user data.
 * @throws {Error} If an error occurs while fetching user data.
 */
export const getUsers = async ({
  page = 0,
  size = 15,
  signal,
}: GetUsersRequest): Promise<GetUsersType> => {
  const url = apiBaseUrl + USERS_API + `?page=${page}&size=${size}`;
  const defaultErrorMessage = 'Unknown error while fetching user data';

  return await handleFetch<GetUsersType>(
    url,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      signal,
    },
    defaultErrorMessage
  );
};

export interface ModifyRoleRequest {
  userId: number;
  role: RoleType;
  signal?: AbortSignal;
}

const defaultRoleUpdateErrorMessage =
  'Error during role modification, try again later';

export const addRole = async ({ userId, role, signal }: ModifyRoleRequest) => {
  const url = apiBaseUrl + USERS_API + `/${userId}/addRole?role=${role.id}`;
  await handleFetchVoid(
    url,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      signal,
    },
    defaultRoleUpdateErrorMessage
  );
};

export const removeRole = async ({
  userId,
  role,
  signal,
}: ModifyRoleRequest) => {
  const url = apiBaseUrl + USERS_API + `/${userId}/removeRole?role=${role.id}`;
  await handleFetchVoid(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    signal,
  });
};
