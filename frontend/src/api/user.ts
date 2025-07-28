import { apiBaseUrl, handleFetchVoid } from './base.ts';
import { RoleType } from '../types/RoleTypes.ts';

const USERS_API = '/users';

export interface ModifyRoleRequest {
  userId: number;
  role: RoleType;
  signal?: AbortSignal;
}

const defaultRoleUpdateErrorMessage =
  'Error during role modification, try again later';

/**
 * Removes a specific role from a user.
 *
 * This asynchronous function sends a PATCH request to the server to remove a designated
 * role from the user specified by the `userId`. The request also includes an authorization
 * token for authentication.
 *
 * @param {Object} params - The parameters for removing a role.
 * @param {string} params.userId - The unique identifier of the user.
 * @param {Object} params.role - The role object to be removed, containing at least an `id` property.
 * @param {AbortSignal} [params.signal] - Optional AbortSignal to allow the request to be aborted.
 *
 * @throws {Error} Throws an error if the API call fails or the request is aborted.
 */
export const removeRole = async ({
  userId,
  role,
  signal,
}: ModifyRoleRequest) => {
  const url = apiBaseUrl + USERS_API + `/${userId}/removeRole?role=${role.id}`;
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
