import * as profileApiModule from '../../../src/store/api/profile.ts';
import { afterEach, beforeEach, expect } from 'vitest';
import { ProfileType } from '../../../src/types/api/ProfileTypes.ts';
import { renderWithProviders } from '../../test-utils.tsx';
import { fireEvent, screen } from '@testing-library/react';
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

  describe('Editability', () => {
    const editButton = 'Edit profile';

    it('Should contain Edit profile button', () => {
      // Given
      renderWithProviders(<Profile />);

      // When
      const editButtonElement = screen.getByRole('button', {
        name: editButton,
      });

      // Then
      expect(editButtonElement).toBeInTheDocument();
    });

    it('Should start editing profile, when edit clicked', () => {
      // Given
      renderWithProviders(<Profile />);
      const editButtonElement = screen.getByRole('button', {
        name: editButton,
      });

      // When
      fireEvent.click(editButtonElement);
      const textboxElements = screen.getAllByRole('textbox');

      // Then
      expect(textboxElements.length).toBeGreaterThan(0);
      textboxElements.forEach((textbox) => {
        expect(textbox).toBeInTheDocument();
      });
    });

    it('Should contain Update and Cancel buttons', () => {
      // Given
      renderWithProviders(<Profile />);
      const editButtonElement = screen.getByRole('button', {
        name: editButton,
      });

      // When
      fireEvent.click(editButtonElement);
      const updateButtonElement = screen.getByRole('button', {
        name: 'Save changes',
      });
      const cancelButtonElement = screen.getByRole('button', {
        name: 'Cancel',
      });

      // Then
      expect(updateButtonElement).toBeInTheDocument();
      expect(cancelButtonElement).toBeInTheDocument();
    });

    it('Should stop editing profile, when cancel clicked', () => {
      // Given
      renderWithProviders(<Profile />);
      const editButtonElement = screen.getByRole('button', {
        name: editButton,
      });
      fireEvent.click(editButtonElement);

      // When
      const cancelButtonElement = screen.getByRole('button', {
        name: 'Cancel',
      });
      fireEvent.click(cancelButtonElement);
      const textboxElements = screen.queryAllByRole('textbox');

      // then
      expect(textboxElements).toHaveLength(0);
    });
  });
});
