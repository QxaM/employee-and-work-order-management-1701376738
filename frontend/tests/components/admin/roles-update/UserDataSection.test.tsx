import { describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import UserDataSection from '../../../../src/components/admin/roles-update/UserDataSection.tsx';
import { UserType } from '../../../../src/types/api/UserTypes.ts';
import { RoleType } from '../../../../src/types/api/RoleTypes.ts';

const roles: RoleType[] = [
  {
    id: 1,
    name: 'ROLE 1',
  },
  {
    id: 2,
    name: 'ROLE 2',
  },
];
const user = {
  id: 1,
  email: 'test@test.com',
  roles,
} as UserType;

describe('UserDataSection', () => {
  it('Should render user ID', () => {
    // Given
    const userIdTitle = 'ID:';
    render(<UserDataSection user={user} />);

    // When
    const userId = screen.getByText(userIdTitle);
    const userIdValue = screen.getByText(user.id);

    // Then
    expect(userId).toBeInTheDocument();
    expect(userIdValue).toBeInTheDocument();
  });

  it('Should render user email', () => {
    // Given
    render(<UserDataSection user={user} />);

    // When
    const userEmailValue = screen.getByText(user.email);

    // Then
    expect(userEmailValue).toBeInTheDocument();
  });

  it('Should render roles count - when single role', () => {
    // Given
    const singleRoleUser = {
      ...user,
      roles: [roles[0]],
    };
    const rolesCountValue = '1 role';

    render(<UserDataSection user={singleRoleUser} />);

    // When
    const rolesCountElement = screen.getByText(rolesCountValue);

    // Then
    expect(rolesCountElement).toBeInTheDocument();
  });

  it('Should render roles count - when multiple roles', () => {
    // Given
    const rolesCountValue = '2 roles';
    render(<UserDataSection user={user} />);

    // When
    const rolesCountElement = screen.getByText(rolesCountValue);

    // Then
    expect(rolesCountElement).toBeInTheDocument();
  });
});
