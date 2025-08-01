import { renderHook } from '@testing-library/react';

import { RoleType } from '../../../../src/types/RoleTypes';
import { useRoleManagement } from '../../../../src/hooks/admin/roles-update/useRoleManagement';
import { act } from 'react';

const roles: RoleType[] = [
  {
    id: 1,
    name: 'ROLE 1',
  },
  {
    id: 2,
    name: 'ROLE 2',
  },
  {
    id: 3,
    name: 'ROLE 3',
  },
];

describe('useRoleManagement', () => {
  it('Should return initial data', () => {
    // Given
    const initialRoles = [roles[0]];

    // When
    const { result } = renderHook(() => useRoleManagement(initialRoles));
    const { currentRoles, selectedRole } = result.current;

    // Then
    expect(selectedRole).toBeNull();
    expect(currentRoles).toHaveLength(initialRoles.length);
    expect(currentRoles).toContain(initialRoles[0]);
  });

  it('Should return available roles', () => {
    // Given
    const initialRoles = [roles[0]];

    // When
    const { result } = renderHook(() => useRoleManagement(initialRoles));
    const availableRoles = result.current.getAvailableRoles(roles);

    // Then
    expect(availableRoles).toHaveLength(roles.length - initialRoles.length);
    expect(availableRoles).not.toContain(initialRoles[0]);
  });

  it('Should return roles to add', () => {
    // Given
    const initialRoles = [roles[0], roles[1]];

    // When
    const { result } = renderHook(() => useRoleManagement(initialRoles));
    const rolesToAdd = result.current.getRolesToAdd([roles[0], roles[2]]);

    // Then
    expect(rolesToAdd).toHaveLength(1);
    expect(rolesToAdd).not.toContain(roles[0]);
    expect(rolesToAdd).toContain(roles[1]);
  });

  it('Should return roles to remove', () => {
    // Given
    const initialRoles = [roles[0], roles[1]];

    // When
    const { result } = renderHook(() => useRoleManagement(initialRoles));
    const rolesToAdd = result.current.getRolesToRemove([roles[0], roles[2]]);

    // Then
    expect(rolesToAdd).toHaveLength(1);
    expect(rolesToAdd).toContain(roles[2]);
    expect(rolesToAdd).not.toContain(roles[0]);
  });

  describe('onRoleClick', () => {
    it('Should select role when not selected', () => {
      // Given
      const initialRoles = [roles[0]];
      const { result } = renderHook(() => useRoleManagement(initialRoles));

      // When
      act(() => {
        result.current.onRoleClick(roles[1]);
      });

      // Then
      const selectedRole = result.current.selectedRole;
      expect(selectedRole).not.toBeNull();
      expect(selectedRole?.id).toStrictEqual(roles[1].id);
      expect(selectedRole?.name).toStrictEqual(roles[1].name);
    });

    it('Should deselect role when selected', () => {
      // Given
      const initialRoles = [roles[0]];
      const { result } = renderHook(() => useRoleManagement(initialRoles));
      act(() => {
        result.current.onRoleClick(roles[1]);
      });

      // When
      act(() => {
        result.current.onRoleClick(roles[1]);
      });

      // Then
      const selectedRole = result.current.selectedRole;
      expect(selectedRole).toBeNull();
    });
  });

  describe('onAddRole', () => {
    it('Should add role to current roles', () => {
      // Given
      const initialRoles = [roles[0]];
      const { result } = renderHook(() => useRoleManagement(initialRoles));
      act(() => {
        result.current.onRoleClick(roles[1]);
      });

      // When
      act(() => {
        result.current.onAddRole();
      });

      // Then
      const currentRoles = result.current.currentRoles;
      expect(currentRoles).toHaveLength(initialRoles.length + 1);
      expect(currentRoles).toContain(roles[1]);
    });

    it('Should deselect selected role after adding role', () => {
      // Given
      const initialRoles = [roles[0]];
      const { result } = renderHook(() => useRoleManagement(initialRoles));
      act(() => {
        result.current.onRoleClick(roles[1]);
      });

      // When
      act(() => {
        result.current.onAddRole();
      });

      // Then
      expect(result.current.selectedRole).toBeNull();
    });

    it('Should not duplicate already assigned role', () => {
      // Given
      const initialRoles = [roles[0]];
      const { result } = renderHook(() => useRoleManagement(initialRoles));
      act(() => {
        result.current.onRoleClick(roles[0]);
      });

      // When
      act(() => {
        result.current.onAddRole();
      });

      // Then
      expect(result.current.currentRoles).toHaveLength(1);
    });
  });

  describe('onRemoveRole', () => {
    it('Should remove role from current roles', () => {
      // Given
      const initialRoles = [roles[0], roles[1]];
      const { result } = renderHook(() => useRoleManagement(initialRoles));
      act(() => {
        result.current.onRoleClick(roles[1]);
      });

      // When
      act(() => {
        result.current.onRemoveRole();
      });

      // Then
      const currentRoles = result.current.currentRoles;
      expect(currentRoles).toHaveLength(initialRoles.length - 1);
      expect(currentRoles).not.toContain(roles[1]);
    });

    it('Should deselect selected role after removing role', () => {
      // Given
      const initialRoles = [roles[0], roles[1]];
      const { result } = renderHook(() => useRoleManagement(initialRoles));
      act(() => {
        result.current.onRoleClick(roles[1]);
      });

      // When
      act(() => {
        result.current.onRemoveRole();
      });

      // Then
      expect(result.current.selectedRole).toBeNull();
    });
  });
});
