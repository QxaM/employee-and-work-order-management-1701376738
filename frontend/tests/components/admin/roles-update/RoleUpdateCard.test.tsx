import { afterEach, beforeEach } from 'vitest';
import * as roleDataModule from '../../../../src/store/api/role.ts';
import { RoleType } from '../../../../src/types/api/RoleTypes.ts';
import { UserType } from '../../../../src/types/api/UserTypes.ts';
import { renderWithProviders } from '../../../test-utils.tsx';
import RoleUpdateCard from '../../../../src/components/admin/roles-update/RoleUpdateCard.tsx';
import { screen } from '@testing-library/react';

const allRoles: RoleType[] = [
  {
    id: 1,
    name: 'ROLE',
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

const rolesData: RoleType[] = [allRoles[0], allRoles[1]];

const user: UserType = {
  id: 1,
  email: 'test@test.com',
  roles: rolesData,
  enabled: true,
};

describe('RoleUpdateCard', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    vi.spyOn(roleDataModule, 'useGetRolesQuery').mockReturnValue({
      data: allRoles,
      isSuccess: true,
      isError: false,
      isLoading: false,
      error: undefined,
      refetch: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Should contain user section', () => {
    // Given
    renderWithProviders(<RoleUpdateCard user={user} />);

    // When
    const userEmailElement = screen.getByText(user.email);

    // Then
    expect(userEmailElement).toBeInTheDocument();
  });

  it('Should contain roles section', () => {
    // Given
    renderWithProviders(<RoleUpdateCard user={user} />);

    // When
    const roleElements = allRoles
      .map((role) => role.name)
      .map((roleName) => screen.getByText(roleName));

    // Then
    expect(roleElements).toHaveLength(allRoles.length);
    roleElements.forEach((element) => {
      expect(element).toBeInTheDocument();
    });
  });
});
