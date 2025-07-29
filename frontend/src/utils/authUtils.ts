import { MeType } from '../store/api/auth.ts';

const ADMIN_ROLE = 'ADMIN';

export const isAdmin = (me: MeType | undefined) => {
  if (!me) {
    return false;
  }

  return me.roles.some((role) => role.name === ADMIN_ROLE);
};
