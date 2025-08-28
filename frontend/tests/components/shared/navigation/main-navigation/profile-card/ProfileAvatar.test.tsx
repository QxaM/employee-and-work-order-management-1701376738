import { DropdownMenu } from '@radix-ui/themes';
import ProfileAvatar from '../../../../../../src/components/shared/navigation/main-navigation/profile-card/ProfileAvatar.tsx';
import { renderWithProviders } from '../../../../../test-utils.tsx';
import * as authApiModule from '../../../../../../src/store/api/auth.ts';
import { MeType } from '../../../../../../src/store/api/auth.ts';
import { beforeEach } from 'vitest';
import { screen } from '@testing-library/react';

const TestWrapper = () => (
  <DropdownMenu.Root>
    <ProfileAvatar />
  </DropdownMenu.Root>
);

describe('ProfileAvatar', () => {
  const mockEmail = 'test@test.com';

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(authApiModule, 'useMeQuery').mockReturnValue({
      data: {
        email: mockEmail,
      } as MeType,
      isSuccess: true,
      isLoading: false,
      isError: false,
      error: undefined,
      refetch: vi.fn(),
    });
  });

  it('Should contain an avatar button', () => {
    // Given
    renderWithProviders(<TestWrapper />);

    // When
    const avatarButton = screen.getByRole('button');

    // Then
    expect(avatarButton).toBeInTheDocument();
  });
});
