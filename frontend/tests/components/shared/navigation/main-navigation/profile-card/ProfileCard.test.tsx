import { beforeEach, expect } from 'vitest';
import * as authApiModule from '../../../../../../src/store/api/auth.ts';
import { MeType } from '../../../../../../src/store/api/auth.ts';
import * as useProfileImageModule from '../../../../../../src/hooks/useProfileImage.tsx';
import { renderWithProviders } from '../../../../../test-utils.tsx';
import ProfileCard
  from '../../../../../../src/components/shared/navigation/main-navigation/profile-card/ProfileCard.tsx';
import { screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

describe('ProfileCard', () => {
  const mockEmail = 'test@test.com';
  const mockClearImage = vi.fn();

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
    vi.spyOn(useProfileImageModule, 'useProfileImage').mockReturnValue({
      imageSrc: undefined,
      clearImage: mockClearImage,
    });
  });

  it('Should contain avatar', async () => {
    // Given
    const firstLetter = mockEmail.charAt(0).toUpperCase();
    renderWithProviders(
      <BrowserRouter>
        <ProfileCard />
      </BrowserRouter>
    );

    // When
    const avatarElement = await screen.findByText(firstLetter);

    // Then
    expect(avatarElement).toBeInTheDocument();
  });

  it('Should contain menu', async () => {
    // Given
    const logoutTitle = 'Logout';
    const user = userEvent.setup();

    renderWithProviders(
      <BrowserRouter>
        <ProfileCard />
      </BrowserRouter>
    );

    const firstLetter = mockEmail.charAt(0).toUpperCase();
    const avatarElement = await screen.findByText(firstLetter);
    await user.click(avatarElement);

    // When
    const logoutElement = await screen.findByText(logoutTitle);

    // Then
    expect(logoutElement).toBeInTheDocument();
  });
});
