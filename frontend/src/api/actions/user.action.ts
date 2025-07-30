import { ActionFunctionArgs } from 'react-router-dom';
import { RoleType } from '../../types/RoleTypes.ts';
import { ActionResponse } from '../../types/ActionTypes.ts';
import { setupStore } from '../../store';
import { rtkDispatch } from '../baseRtk.ts';
import { usersApi } from '../../store/api/user.ts';
import { QueryError } from '../../types/ApiTypes.ts';

interface SubmitUpdateRoleUnserialized {
  userId: number;
  addRoles: string;
  removeRoles: string;
}

interface SubmitUpdateRoleType {
  userId: number;
  addRoles: RoleType[];
  removeRoles: RoleType[];
}

/**
 * Handles updating user roles by adding and/or removing roles for a specified user.
 *
 * @param {Object} args - The arguments object.
 * @param store
 * @param {ActionFunctionArgs} args.request - The request object containing the role update data.
 * @returns {Promise<ActionResponse<null>>} A promise resolving to the success state of the action.
 *
 * The function:
 * - Parses the incoming request payload to extract roles to add and remove.
 * - Adds specified roles to the user and removes others concurrently.
 * - Returns a success or failure response with an error message upon failure.
 */
export const updateRoles = async (
  store: ReturnType<typeof setupStore>,
  { request }: ActionFunctionArgs
): Promise<ActionResponse<null>> => {
  try {
    const data = (await request.json()) as SubmitUpdateRoleUnserialized;
    const updateRoles: SubmitUpdateRoleType = {
      userId: data.userId,
      addRoles: JSON.parse(data.addRoles) as RoleType[],
      removeRoles: JSON.parse(data.removeRoles) as RoleType[],
    };

    await Promise.all([
      ...updateRoles.addRoles.map((role) =>
        rtkDispatch<undefined>(
          store,
          usersApi.endpoints.addRole.initiate({
            userId: updateRoles.userId,
            role,
          })
        )
      ),
      ...updateRoles.removeRoles.map((role) =>
        rtkDispatch<undefined>(
          store,
          usersApi.endpoints.removeRole.initiate({
            userId: updateRoles.userId,
            role,
          })
        )
      ),
    ]);
  } catch (error) {
    const returnedError =
      error instanceof Error
        ? error
        : new Error((error as QueryError)?.message);
    return { success: false, data: undefined, error: returnedError };
  }

  return { success: true, data: null };
};
