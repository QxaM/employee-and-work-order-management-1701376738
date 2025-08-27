import * as usersApiModule from '../../../../../src/store/api/user.ts';
import { beforeEach } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '../../../../test-utils.tsx';
import AvailableRoles from '../../../../../src/components/admin/roles-update/roles-list/AvailableRoles.tsx';

const USER_ID = 1;
const AVAILABLE_ROLES = [
  {
    id: 1,
    name: 'ADMIN',
  },
];

describe('AvailableRoles', () => {
  const mockAddRole = vi.fn();
  const mockResults = {
    reset: vi.fn(),
  };

  beforeEach(() => {
    return vi
      .spyOn(usersApiModule, 'useAddRoleMutation')
      .mockReturnValue([mockAddRole, mockResults]);
  });

  it('Should contain role button', () => {
    // Given
    renderWithProviders(
      <AvailableRoles userId={USER_ID} availableRoles={AVAILABLE_ROLES} />
    );

    // When
    const roleButton = screen.getByRole('button', {
      name: AVAILABLE_ROLES[0].name,
    });

    // Then
    expect(roleButton).toBeInTheDocument();
  });

  it('Should call addRole on button click', () => {
    // Given
    renderWithProviders(
      <AvailableRoles userId={USER_ID} availableRoles={AVAILABLE_ROLES} />
    );
    const roleButton = screen.getByRole('button', {
      name: AVAILABLE_ROLES[0].name,
    });

    // When
    fireEvent.click(roleButton);

    // Then
    expect(mockAddRole).toHaveBeenCalledOnce();
    expect(mockAddRole).toHaveBeenCalledWith({
      userId: USER_ID,
      role: AVAILABLE_ROLES[0],
    });
  });
});
