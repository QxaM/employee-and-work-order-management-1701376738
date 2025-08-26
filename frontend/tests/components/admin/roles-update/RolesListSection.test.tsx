import { beforeEach, describe } from 'vitest';
import { screen, within } from '@testing-library/react';

import RolesListSection from '../../../../src/components/admin/roles-update/RolesListSection.tsx';
import { RoleType } from '../../../../src/types/api/RoleTypes.ts';
import { UserType } from '../../../../src/types/api/UserTypes.ts';
import * as roleDataModule from '../../../../src/store/api/role.ts';
import { renderWithProviders } from '../../../test-utils.tsx';

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

describe('RolesListSection', () => {
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

  it('Should render assigned roles to user', () => {
    // Given
    const title = 'Current roles:';
    renderWithProviders(<RolesListSection user={user} />);

    // When
    const titleElement = screen.getByText(title);

    // Then
    expect(titleElement).toBeInTheDocument();
  });

  it('Should render available roles when roles fetch success', () => {
    // Given
    const title = 'Add role:';
    renderWithProviders(<RolesListSection user={user} />);

    // When
    const titleElement = screen.getByText(title);

    // Then
    expect(titleElement).toBeInTheDocument();
  });

  it('Should render spinner when roles fetching pending', async () => {
    // Given
    const testId = 'spinner';
    vi.spyOn(roleDataModule, 'useGetRolesQuery').mockReturnValue({
      data: undefined,
      isSuccess: false,
      isError: false,
      isFetching: true,
      error: undefined,
      refetch: vi.fn(),
    });

    renderWithProviders(<RolesListSection user={user} />);

    // When
    const spinnerElement = await screen.findByTestId(testId);

    // Then
    expect(spinnerElement).toBeInTheDocument();
  });

  it('Should render error element when fetching error', async () => {
    // Given
    const error = 'Test error';
    vi.spyOn(roleDataModule, 'useGetRolesQuery').mockReturnValue({
      data: undefined,
      isSuccess: false,
      isError: true,
      isFetching: false,
      error: new Error(error),
      refetch: vi.fn(),
    });

    renderWithProviders(<RolesListSection user={user} />);

    // When
    const errorElement = await screen.findByText(error);

    // Then
    expect(errorElement).toBeInTheDocument();
  });

  it('Should filter available roles', () => {
    // Given
    const availableRolesTitle = 'Add role:';
    const availableRoles = allRoles.filter(
      (role) => !rolesData.some((userRole) => userRole.id === role.id)
    );
    renderWithProviders(<RolesListSection user={user} />);

    // When
    const wrapper = screen.getByText(availableRolesTitle).parentElement;

    let availableRolesElements: HTMLElement[] = [];
    if (wrapper) {
      availableRolesElements = availableRoles.map((role) =>
        within(wrapper).getByText(role.name)
      );
    }

    // Then
    expect(availableRolesElements).toHaveLength(availableRoles.length);
    availableRolesElements.forEach((element) => {
      expect(element).toBeInTheDocument();
    });
  });
});
