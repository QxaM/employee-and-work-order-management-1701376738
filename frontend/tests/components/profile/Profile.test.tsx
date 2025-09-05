import * as profileApiModule from '../../../src/store/api/profile.ts';
import * as useMeDataModule from '../../../src/hooks/useMeData.tsx';
import * as useImageUploadModule from '../../../src/hooks/useImageUpload.tsx';
import { afterEach, beforeEach, describe, expect } from 'vitest';
import {
  ProfileType,
  UpdateProfileType,
} from '../../../src/types/api/ProfileTypes.ts';
import { renderWithProviders } from '../../test-utils.tsx';
import { fireEvent, screen } from '@testing-library/react';
import Profile from '../../../src/components/profile/Profile.tsx';
import { UserEvent, userEvent } from '@testing-library/user-event';
import { MeType } from '../../../src/store/api/auth.ts';
import { RoleType } from '../../../src/types/api/RoleTypes.ts';

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

describe('Profile', () => {
  const editButton = 'Edit profile';
  const mockProfileUpdate = vi.fn();
  const mockUploadCancel = vi.fn();

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
      mockProfileUpdate,
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
      handleCancel: mockUploadCancel,
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

  it('Should contain profile avatar component', () => {
    // Given
    const avatarTestId = 'avatar-container';
    renderWithProviders(<Profile />);

    // When
    const avatarComponent = screen.getByTestId(avatarTestId);

    // Then
    expect(avatarComponent).toBeInTheDocument();
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

    // When
    const emailElement = screen.getByText(profileData.email);

    // Then
    expect(emailElement).toBeInTheDocument();
  });

  it('Should render roles', () => {
    // Given
    const rolesTitle = 'Assigned Roles';
    renderWithProviders(<Profile />);

    // When
    const titleElement = screen.getByRole('heading', { name: rolesTitle });
    const roleElements = meData.roles.map((role) =>
      screen.getByText(role.name)
    );

    // Then
    expect(titleElement).toBeInTheDocument();
    expect(roleElements).toHaveLength(meData.roles.length);
    roleElements.forEach((element) => {
      expect(element).toBeInTheDocument();
    });
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
      expect(mockUploadCancel).toHaveBeenCalledOnce();
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
