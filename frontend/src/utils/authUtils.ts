import { MeType } from '../store/api/auth.ts';
import { Role } from '../types/AuthorizationTypes.ts';

const ADMIN_ROLE: Role = 'ADMIN';

export const isAdmin = (me: MeType | undefined) => {
  if (!me) {
    return false;
  }

  return me.roles.some((role) => role.name === ADMIN_ROLE);
};
