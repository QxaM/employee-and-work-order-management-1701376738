import { beforeEach, describe } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import RolesListSection from '../../../../src/components/admin/roles-update/RolesListSection.tsx';
import { RoleType } from '../../../../src/types/RoleTypes.ts';

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
const mockOnRoleClick = vi.fn();

describe('RolesListSection', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('Should render assigner roles section title', () => {
    // Given
    render(
      <RolesListSection
        title={title}
        roles={rolesData}
        selectedRole={null}
        onRoleClick={mockOnRoleClick}
      />
    );

    // When
    const titleElement = screen.getByText(title);

    // Then
    expect(titleElement).toBeInTheDocument();
  });

  it('Should render assigned roles to user', () => {
    // Given
    render(
      <RolesListSection
        title={title}
        roles={rolesData}
        selectedRole={null}
        onRoleClick={mockOnRoleClick}
      />
    );

    // When
    const rolesElements = rolesData.map((role) => screen.getByText(role.name));

    // Then
    expect(rolesElements).toHaveLength(rolesData.length);
    for (const roleElement of rolesElements) {
      expect(roleElement).toBeInTheDocument();
    }
  });

  it('Should fire on role when clicked', () => {
    // Given
    render(
      <RolesListSection
        title={title}
        roles={rolesData}
        selectedRole={null}
        onRoleClick={mockOnRoleClick}
      />
    );

    const firstRole = screen.getAllByRole('button')[0];

    // When
    fireEvent.click(firstRole);

    // Then
    expect(mockOnRoleClick).toHaveBeenCalledOnce();
    expect(mockOnRoleClick).toHaveBeenCalledWith(rolesData[0]);
  });

  it('Should select element when selected role is passed', () => {
    // Given
    const deselectedStyles = 'bg-qxam-neutral-light-lighter';
    const selectedStyles = 'bg-qxam-secondary-lightest';
    render(
      <RolesListSection
        title={title}
        roles={rolesData}
        selectedRole={rolesData[0]}
        onRoleClick={mockOnRoleClick}
      />
    );

    // When
    const firstRole = screen.getByRole('button', { name: rolesData[0].name });
    const secondRole = screen.getByRole('button', { name: rolesData[1].name });

    // Then
    expect(firstRole).toHaveClass(selectedStyles);
    expect(secondRole).toHaveClass(deselectedStyles);
  });
});
