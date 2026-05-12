import type { GetUsersType } from '../../types/api/UserTypes.ts';
import type { RoleType } from '../../types/api/RoleTypes.ts';

export const addRoleToDraftUser = (
  draft: GetUsersType,
  userId: number,
  role: RoleType
) => {
  const updatingUser = draft.content.find((user) => user.id === userId);
  if (!updatingUser) {
    return;
  }

  updatingUser.roles.push(role);
};

export const removeRoleFromDraftUser = (
  draft: GetUsersType,
  userId: number,
  role: RoleType
) => {
  const updatingUser = draft.content.find((user) => user.id === userId);
  if (!updatingUser) {
    return;
  }

  updatingUser.roles = updatingUser.roles.filter(
    (userRole) => userRole.id !== role.id
  );
};
