import { useState } from 'react';
import { RoleType } from '../../../types/RoleTypes';

export const useRoleManagement = (initialRoles: RoleType[]) => {
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
  const [currentRoles, setCurrentRoles] = useState<RoleType[]>(initialRoles);

  const getAvailableRoles = (allRoles: RoleType[]): RoleType[] => {
    return allRoles.filter(
      (role) => !currentRoles.some((userRole) => userRole.id === role.id)
    );
  };

  const getRolesToAdd = (userRoles: RoleType[]): RoleType[] => {
    return currentRoles.filter(
      (addedRole) => !userRoles.some((role) => role.id === addedRole.id)
    );
  };

  const getRolesToRemove = (userRoles: RoleType[]): RoleType[] => {
    return userRoles.filter(
      (role) => !currentRoles.some((addedRole) => addedRole.id === role.id)
    );
  };

  const onRoleClick = (role: RoleType) => {
    if (selectedRole?.id === role.id) {
      setSelectedRole(null);
    } else {
      setSelectedRole(role);
    }
  };

  const onAddRole = () => {
    if (selectedRole) {
      setCurrentRoles([...currentRoles, selectedRole]);
      setSelectedRole(null);
    }
  };

  const onRemoveRole = () => {
    if (selectedRole) {
      setCurrentRoles(
        currentRoles.filter((role) => role.id !== selectedRole.id)
      );
      setSelectedRole(null);
    }
  };

  return {
    selectedRole,
    currentRoles,
    getAvailableRoles,
    getRolesToAdd,
    getRolesToRemove,
    onRoleClick,
    onAddRole,
    onRemoveRole,
  };
};
