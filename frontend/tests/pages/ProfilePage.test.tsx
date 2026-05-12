import { screen } from '@testing-library/react';
import { afterEach, beforeEach } from 'vitest';
import * as useImageUploadModule from '../../src/hooks/useImageUpload.tsx';
import * as useMeDataModule from '../../src/hooks/useMeData.tsx';
import ProfilePage from '../../src/pages/ProfilePage.tsx';
import type { MeType } from '../../src/store/api/auth.ts';
import * as profileApiModule from '../../src/store/api/profile.ts';
import type { ProfileType } from '../../src/types/api/ProfileTypes.ts';
import type { RoleType } from '../../src/types/api/RoleTypes.ts';
import { renderWithProviders } from '../test-utils.tsx';

const email = 'test@test.com';
const profileData: ProfileType = {
  firstName: 'John',
  middleName: 'Jack',
  lastName: 'Doe',
  email,
};
const roles: RoleType[] = [
  {
    id: 1,
    name: 'OPERATOR',
  },
];
const meData: MeType = {
  email,
  roles,
};

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    vi.spyOn(profileApiModule, 'useMyProfileQuery').mockReturnValue({
      isSuccess: true,
      isLoading: false,
      isError: false,
      data: profileData,
      refetch: vi.fn(),
    });
    vi.spyOn(useMeDataModule, 'useMeData').mockReturnValue({
      me: meData,
      isLoading: false,
      isError: false,
    });
    vi.spyOn(profileApiModule, 'useUpdateMyProfileMutation').mockReturnValue([
      vi.fn(),
      {
        isLoading: false,
        isError: false,
        isSuccess: false,
        error: undefined,
        reset: vi.fn(),
      },
    ]);
    vi.spyOn(useImageUploadModule, 'useImageUpload').mockReturnValue({
      selectedFile: undefined,
      dragActive: false,
      validationErrors: [],
      isValidationError: false,
      handleChange: vi.fn(),
      handleDrag: vi.fn(),
      handleDrop: vi.fn(),
      handleCancel: vi.fn(),
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
