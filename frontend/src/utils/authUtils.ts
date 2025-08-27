import { MeType } from '../store/api/auth.ts';
import { Role } from '../types/api/AuthorizationTypes.ts';

const ADMIN_ROLE: Role = 'ADMIN';

/**
 * Determines whether the provided user has administrative privileges.
 *
 * This function checks if the given user object contains a role with the name
 * corresponding to the administrator role. If the user object is undefined
 * or does not include such a role, the function returns false.
 *
 * @param {MeType | undefined} me - The user object containing role information, or undefined.
 * @returns {boolean} True if the user has an admin role, otherwise false.
 */
export const isAdmin = (me: MeType | undefined): boolean => {
  if (!me) {
    return false;
  }

  return me.roles.some((role) => role.name === ADMIN_ROLE);
};
