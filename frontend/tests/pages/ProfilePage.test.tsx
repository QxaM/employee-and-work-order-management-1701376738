import { renderWithProviders } from '../test-utils.tsx';
import ProfilePage from '../../src/pages/ProfilePage.tsx';
import { screen } from '@testing-library/react';
import * as profileApiModule from '../../src/store/api/profile.ts';
import { afterEach, beforeEach } from 'vitest';
import { ProfileType } from '../../src/types/api/ProfileTypes.ts';

const profileData: ProfileType = {
  firstName: 'John',
  middleName: 'Jack',
  lastName: 'Doe',
  email: 'test@test.com',
};

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(profileApiModule, 'useMyProfileQuery').mockReturnValue({
      isSuccess: true,
      isLoading: false,
      isError: false,
      data: profileData,
      refetch: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Should render profile', () => {
    // Given
    const title = 'Profile';
    renderWithProviders(<ProfilePage />);

    // When
    const titleElement = screen.getByRole('heading', { name: title });

    // Then
    expect(titleElement).toBeInTheDocument();
  });
});
