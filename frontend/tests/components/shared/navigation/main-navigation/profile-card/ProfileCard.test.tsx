import { beforeEach, expect } from 'vitest';
import * as authApiModule from '../../../../../../src/store/api/auth.ts';
import { MeType } from '../../../../../../src/store/api/auth.ts';
import { renderWithProviders } from '../../../../../test-utils.tsx';
import ProfileCard from '../../../../../../src/components/shared/navigation/main-navigation/profile-card/ProfileCard.tsx';
import { screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

describe('ProfileCard', () => {
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

  it('Should contain avatar', async () => {
    // Given
    const firstLetter = mockEmail.charAt(0).toUpperCase();
    renderWithProviders(<ProfileCard />);

    // When
    const avatarElement = await screen.findByText(firstLetter);

    // Then
    expect(avatarElement).toBeInTheDocument();
  });

  it('Should contain menu', async () => {
    // Given
    const logoutTitle = 'Logout';
    const user = userEvent.setup();

    renderWithProviders(<ProfileCard />);

    const firstLetter = mockEmail.charAt(0).toUpperCase();
    const avatarElement = await screen.findByText(firstLetter);
    await user.click(avatarElement);

    // When
    const logoutElement = await screen.findByText(logoutTitle);

    // Then
    expect(logoutElement).toBeInTheDocument();
  });
});
