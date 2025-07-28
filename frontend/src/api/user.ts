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
 * Asynchronously adds a role to a specified user.
 *
 * This function sends a PATCH request to update the role assigned
 * to a user. It constructs the request using the user's ID and the
 * role's ID. The operation is abortable using an AbortSignal provided
 * via the signal parameter.
 *
 * @param {ModifyRoleRequest} params - The parameters for modifying the role.
 * @param {string} params.userId - The unique identifier of the user to whom the role will be added.
 * @param {Object} params.role - The role object containing information about the role to add.
 * @param {AbortSignal} params.signal - Signal object for request cancellation.
 * @throws {Error} Throws an error if the fetch operation fails or if the response indicates a failure.
 */
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
