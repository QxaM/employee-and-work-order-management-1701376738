import { renderWithProviders } from '../test-utils.tsx';
import ProfilePage from '../../src/pages/ProfilePage.tsx';
import { screen } from '@testing-library/react';
import * as profileApiModule from '../../src/store/api/profile.ts';
import * as useMeDataModule from '../../src/hooks/useMeData.tsx';
import * as useImageUploadModule from '../../src/hooks/useImageUpload.tsx';
import { afterEach, beforeEach } from 'vitest';
import { ProfileType } from '../../src/types/api/ProfileTypes.ts';
import { RoleType } from '../../src/types/api/RoleTypes.ts';
import { MeType } from '../../src/store/api/auth.ts';

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
    vi.clearAllMocks();

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
