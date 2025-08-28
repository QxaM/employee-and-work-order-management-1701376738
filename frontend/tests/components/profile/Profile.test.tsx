import * as profileApiModule from '../../../src/store/api/profile.ts';
import { afterEach, beforeEach, expect } from 'vitest';
import { ProfileType } from '../../../src/types/api/ProfileTypes.ts';
import { renderWithProviders } from '../../test-utils.tsx';
import { screen } from '@testing-library/react';
import Profile from '../../../src/components/profile/Profile.tsx';

const profileData: ProfileType = {
  firstName: 'John',
  middleName: 'Jack',
  lastName: 'Doe',
  email: 'test@test.com',
};

describe('Profile', () => {
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

  it('Should contain title', () => {
    // Given
    const title = 'Profile';
    renderWithProviders(<Profile />);

    // When
    const titleElement = screen.getByRole('heading', { name: title });

    // Then
    expect(titleElement).toBeInTheDocument();
  });

  it('Should contain personal information and email section', () => {
    // Given
    const personalInformationTitle = 'Personal Information';
    const emailTitle = 'Email Address';
    renderWithProviders(<Profile />);

    // When
    const personalInformationElement = screen.getByRole('heading', {
      name: personalInformationTitle,
    });
    const emailElement = screen.getByRole('heading', { name: emailTitle });

    // Then
    expect(personalInformationElement).toBeInTheDocument();
    expect(emailElement).toBeInTheDocument();
  });

  it('Should render personal data', () => {
    // Given
    renderWithProviders(<Profile />);

    // When
    const firstNameElement = screen.getByText(profileData.firstName);
    const middleNameElement = screen.getByText(profileData.middleName);
    const lastNameElement = screen.getByText(profileData.lastName);

    // Then
    expect(firstNameElement).toBeInTheDocument();
    expect(middleNameElement).toBeInTheDocument();
    expect(lastNameElement).toBeInTheDocument();
  });

  it('Should render email', () => {
    // Given
    renderWithProviders(<Profile />);

    // when
    const emailElement = screen.getByText(profileData.email);

    // Then
    expect(emailElement).toBeInTheDocument();
  });
});
