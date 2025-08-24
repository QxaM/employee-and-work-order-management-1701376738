import { beforeEach, describe } from 'vitest';
import { render, screen } from '@testing-library/react';

import RolesListSection from '../../../../src/components/admin/roles-update/RolesListSection.tsx';
import { RoleType } from '../../../../src/types/api/RoleTypes.ts';
import { ToggleGroup } from 'radix-ui';

const title = 'Assigned Roles';
const rolesData: RoleType[] = [
  {
    id: 1,
    name: 'ROLE',
  },
  {
    id: 2,
    name: 'ROLE 2',
  },
];

describe('RolesListSection', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('Should render assigned roles section title', () => {
    // Given
    render(
      <ToggleGroup.Root type="single">
        <RolesListSection title={title} roles={rolesData} />
      </ToggleGroup.Root>
    );

    // When
    const titleElement = screen.getByText(title);

    // Then
    expect(titleElement).toBeInTheDocument();
  });

  it('Should render assigned roles to user', () => {
    // Given
    render(
      <ToggleGroup.Root type="single">
        <RolesListSection title={title} roles={rolesData} />
      </ToggleGroup.Root>
    );

    // When
    const rolesElements = rolesData.map((role) => screen.getByText(role.name));

    // Then
    expect(rolesElements).toHaveLength(rolesData.length);
    for (const roleElement of rolesElements) {
      expect(roleElement).toBeInTheDocument();
    }
  });
});
