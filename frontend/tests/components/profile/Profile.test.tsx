import * as profileApiModule from '../../../src/store/api/profile.ts';
import { afterEach, beforeEach, describe, expect } from 'vitest';
import { ProfileType, UpdateProfileType, } from '../../../src/types/api/ProfileTypes.ts';
import { renderWithProviders } from '../../test-utils.tsx';
import { fireEvent, screen } from '@testing-library/react';
import Profile from '../../../src/components/profile/Profile.tsx';
import { UserEvent, userEvent } from '@testing-library/user-event';

const profileData: ProfileType = {
  firstName: 'John',
  middleName: 'Jack',
  lastName: 'Doe',
  email: 'test@test.com',
};

describe('Profile', () => {
  const editButton = 'Edit profile';
  const mockProfileUpdate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(profileApiModule, 'useMyProfileQuery').mockReturnValue({
      isSuccess: true,
      isLoading: false,
      isError: false,
      data: profileData,
      refetch: vi.fn(),
    });
    vi.spyOn(profileApiModule, 'useUpdateMyProfileMutation').mockReturnValue([
      mockProfileUpdate,
      {
        isLoading: false,
        isError: false,
        isSuccess: false,
        error: undefined,
        reset: vi.fn(),
      },
    ]);
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
    const emailTitle = 'email address';
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
    const middleNameElement = screen.getByText(profileData.middleName ?? '');
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

    it('Should stop editing profile, when save clicked', () => {
      // Given
      renderWithProviders(<Profile />);
      const editButtonElement = screen.getByRole('button', {
        name: editButton,
      });
      fireEvent.click(editButtonElement);

      // When
      const saveButtonElement = screen.getByRole('button', {
        name: 'Save changes',
      });
      fireEvent.click(saveButtonElement);
      const textboxElements = screen.queryAllByRole('textbox');

      // then
      expect(textboxElements).toHaveLength(0);
    });
  });

  describe('Validation', () => {
    const saveButton = 'Save changes';
    let user: UserEvent;

    beforeEach(() => {
      user = userEvent.setup();
    });

    it('Should validate first name', async () => {
      // Given
      const errorMessage = 'first name is required';
      renderWithProviders(<Profile />);
      const editButtonElement = screen.getByRole('button', {
        name: editButton,
      });
      await user.click(editButtonElement);

      // When
      const firstNameElement = screen.getByPlaceholderText('first name');
      await user.clear(firstNameElement);

      const saveButtonElement = screen.getByRole('button', {
        name: saveButton,
      });
      await user.click(saveButtonElement);
      const errorElement = await screen.findByText(errorMessage);

      // Then
      expect(errorElement).toBeInTheDocument();
    });

    it('Should validate last name', async () => {
      // Given
      const errorMessage = 'last name is required';
      renderWithProviders(<Profile />);
      const editButtonElement = screen.getByRole('button', {
        name: editButton,
      });
      await user.click(editButtonElement);

      // When
      const lastNameElement = screen.getByPlaceholderText('last name');
      await user.clear(lastNameElement);

      const saveButtonElement = screen.getByRole('button', {
        name: saveButton,
      });
      await user.click(saveButtonElement);
      const errorElement = await screen.findByText(errorMessage);

      // Then
      expect(errorElement).toBeInTheDocument();
    });
  });

  describe('Form submission', () => {
    let user: UserEvent;
    const saveButton = 'Save changes';
    const updatedProfile: UpdateProfileType = {
      firstName: 'UpdatedName',
      middleName: 'UpdatedMiddleName',
      lastName: 'UpdatedLastName',
    };

    beforeEach(() => {
      user = userEvent.setup();
    });

    it('Should call update profile mutation, when save clicked', async () => {
      // Given
      renderWithProviders(<Profile />);
      const editButtonElement = screen.getByRole('button', {
        name: editButton,
      });
      await user.click(editButtonElement);
      const firstNameElement = screen.getByPlaceholderText('first name');
      const middleNameElement = screen.getByPlaceholderText('middle name');
      const lastNameElement = screen.getByPlaceholderText('last name');

      // When
      await user.clear(firstNameElement);
      await user.type(firstNameElement, updatedProfile.firstName);
      await user.clear(middleNameElement);
      await user.type(middleNameElement, updatedProfile.middleName ?? '');
      await user.clear(lastNameElement);
      await user.type(lastNameElement, updatedProfile.lastName);
      const saveButtonElement = screen.getByRole('button', {
        name: saveButton,
      });
      await user.click(saveButtonElement);

      // Then
      expect(mockProfileUpdate).toHaveBeenCalledOnce();
      expect(mockProfileUpdate).toHaveBeenCalledWith(updatedProfile);
    });
  });
});
