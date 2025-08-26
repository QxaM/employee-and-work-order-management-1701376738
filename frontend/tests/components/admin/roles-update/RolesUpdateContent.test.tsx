import { afterEach, beforeEach } from 'vitest';
import * as roleDataModule from '../../../../src/store/api/role.ts';
import { RoleType } from '../../../../src/types/api/RoleTypes.ts';
import { UserType } from '../../../../src/types/api/UserTypes.ts';
import { renderWithProviders } from '../../../test-utils.tsx';
import RolesUpdateContent from '../../../../src/components/admin/roles-update/RolesUpdateContent.tsx';
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

const users: UserType[] = [
  {
    id: 1,
    email: 'test1@test.com',
    roles: rolesData,
    enabled: true,
  },
  {
    id: 2,
    email: 'test2@test.com',
    roles: rolesData,
    enabled: true,
  },
];

describe('RolesUpdateContent', () => {
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

  it('Should render update cards', () => {
    // Given
    renderWithProviders(<RolesUpdateContent users={users} />);

    // When
    const updateCards = users
      .map((user) => user.email)
      .map((email) => screen.getByText(email));

    // Then
    expect(updateCards).toHaveLength(users.length);
    updateCards.forEach((element) => {
      expect(element).toBeInTheDocument();
    });
  });
});
