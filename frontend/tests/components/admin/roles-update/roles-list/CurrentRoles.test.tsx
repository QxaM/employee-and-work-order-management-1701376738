import { beforeEach } from 'vitest';
import * as usersApiModule from '../../../../../src/store/api/user.ts';
import { renderWithProviders } from '../../../../test-utils.tsx';
import { fireEvent, screen } from '@testing-library/react';
import CurrentRoles from '../../../../../src/components/admin/roles-update/roles-list/CurrentRoles.tsx';

const USER_ID = 1;
const CURRENT_ROLES = [
  {
    id: 1,
    name: 'ADMIN',
  },
];

describe('AvailableRoles', () => {
  const mockRemoveRole = vi.fn();
  const mockResults = {
    reset: vi.fn(),
  };

  beforeEach(() => {
    return vi
      .spyOn(usersApiModule, 'useRemoveRoleMutation')
      .mockReturnValue([mockRemoveRole, mockResults]);
  });

  it('Should contain role button', () => {
    // Given
    renderWithProviders(
      <CurrentRoles userId={USER_ID} currentRoles={CURRENT_ROLES} />
    );

    // When
    const roleButton = screen.getByRole('button', {
      name: CURRENT_ROLES[0].name,
    });

    // Then
    expect(roleButton).toBeInTheDocument();
  });

  it('Should call addRole on button click', () => {
    // Given
    renderWithProviders(
      <CurrentRoles userId={USER_ID} currentRoles={CURRENT_ROLES} />
    );
    const roleButton = screen.getByRole('button', {
      name: CURRENT_ROLES[0].name,
    });

    // When
    fireEvent.click(roleButton);

    // Then
    expect(mockRemoveRole).toHaveBeenCalledOnce();
    expect(mockRemoveRole).toHaveBeenCalledWith({
      userId: USER_ID,
      role: CURRENT_ROLES[0],
    });
  });
});
