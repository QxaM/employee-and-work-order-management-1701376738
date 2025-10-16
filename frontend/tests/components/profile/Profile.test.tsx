import * as profileApiModule from '../../../src/store/api/profile.ts';
import * as useMeDataModule from '../../../src/hooks/useMeData.tsx';
import * as useImageUploadModule from '../../../src/hooks/useImageUpload.tsx';
import * as useProfileImageModule from '../../../src/hooks/useProfileImage.tsx';
import { afterEach, beforeEach, describe, expect } from 'vitest';
import { ProfileType, UpdateProfileType, } from '../../../src/types/api/ProfileTypes.ts';
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
  const mockImageUpload = vi.fn();
  const mockUploadCancel = vi.fn();
  const mockClearImage = vi.fn();

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
    vi.spyOn(
      profileApiModule,
      'useUpdateMyProfileImageMutation'
    ).mockReturnValue([
      mockImageUpload,
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
    vi.spyOn(useProfileImageModule, 'useProfileImage').mockReturnValue({
      imageSrc: undefined,
      clearImage: mockClearImage,
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

    it('Should call update image when image selected', async () => {
      // Given
      const file = new File(['test-file'], 'test.png', { type: 'image/png' });
      vi.spyOn(useImageUploadModule, 'useImageUpload').mockReturnValue({
        selectedFile: {
          file,
          name: 'test.png',
          size: 100000,
          preview: 'test.png',
        },
        dragActive: false,
        validationErrors: [],
        isValidationError: false,
        handleChange: vi.fn(),
        handleDrag: vi.fn(),
        handleDrop: vi.fn(),
        handleCancel: mockUploadCancel,
      });

      renderWithProviders(<Profile />);
      const editButtonElement = screen.getByRole('button', {
        name: editButton,
      });
      await user.click(editButtonElement);

      // When
      const saveButtonElement = screen.getByRole('button', {
        name: saveButton,
      });
      await user.click(saveButtonElement);

      // Then
      expect(mockImageUpload).toHaveBeenCalledOnce();

      const formData = new FormData();
      formData.append('file', file);
      expect(mockImageUpload).toHaveBeenCalledWith(formData);

      expect(mockClearImage).toHaveBeenCalledOnce();
    });

    it('Should not call update image when image is not selected', async () => {
      // Given
      renderWithProviders(<Profile />);
      const editButtonElement = screen.getByRole('button', {
        name: editButton,
      });
      await user.click(editButtonElement);

      // When
      const saveButtonElement = screen.getByRole('button', {
        name: saveButton,
      });
      await user.click(saveButtonElement);

      // Then
      expect(mockImageUpload).not.toHaveBeenCalled();
      expect(mockClearImage).not.toHaveBeenCalled();
    });
  });

  describe('Dialog dispatch', () => {
    beforeEach(() => {
      vi.spyOn(
        profileApiModule,
        'useUpdateMyProfileImageMutation'
      ).mockReturnValue([
        mockImageUpload,
        {
          isSuccess: true,
          isError: false,
          isPending: false,
          error: undefined,
          reset: vi.fn(),
        },
      ]);
    });

    it('Should dispatch success modal', () => {
      // Given

      // When
      const { store } = renderWithProviders(<Profile />);

      // Then
      const modalSlice = store.getState().modal;
      expect(modalSlice.modals).toContainEqual({
        content: {
          type: 'success',
          message: 'Profile image updated successfully',
          hideTimeout: 15000,
        },
        id: expect.any(String) as string,
      });
    });

    it('Should dispatch error modal', () => {
      // Given
      const errorMessage = 'Error message';
      vi.spyOn(
        profileApiModule,
        'useUpdateMyProfileImageMutation'
      ).mockReturnValue([
        mockImageUpload,
        {
          isSuccess: false,
          isError: true,
          isPending: false,
          error: {
            message: errorMessage,
          },
          reset: vi.fn(),
        },
      ]);

      // When
      const { store } = renderWithProviders(<Profile />);

      // Then
      const modalSlice = store.getState().modal;
      expect(modalSlice.modals).toContainEqual({
        content: {
          type: 'error',
          message: errorMessage,
          hideTimeout: 30_000,
        },
        id: expect.any(String) as string,
      });
    });

    it('Should dispatch error modal when no cause undefined', () => {
      // Given
      const errorMessage = 'Error message';
      vi.spyOn(
        profileApiModule,
        'useUpdateMyProfileImageMutation'
      ).mockReturnValue([
        mockImageUpload,
        {
          isSuccess: false,
          isError: true,
          isPending: false,
          error: {
            message: errorMessage,
            cause: undefined,
          },
          reset: vi.fn(),
        },
      ]);

      // When
      const { store } = renderWithProviders(<Profile />);

      // Then
      const modalSlice = store.getState().modal;
      expect(modalSlice.modals).toContainEqual({
        content: {
          type: 'error',
          message: errorMessage,
          hideTimeout: 30_000,
        },
        id: expect.any(String) as string,
      });
    });

    it('Should dispatch error modal with cause', () => {
      // Given
      const errorMessage = 'Error message';
      const cause = ['Cause 1', 'Cause 2'];
      vi.spyOn(
        profileApiModule,
        'useUpdateMyProfileImageMutation'
      ).mockReturnValue([
        mockImageUpload,
        {
          isSuccess: false,
          isError: true,
          isPending: false,
          error: {
            message: errorMessage,
            cause,
          },
          reset: vi.fn(),
        },
      ]);

      // When
      const { store } = renderWithProviders(<Profile />);

      // Then
      const modalSlice = store.getState().modal;
      expect(modalSlice.modals).toContainEqual({
        content: {
          type: 'error',
          message: {
            message: errorMessage,
            cause,
          },
          hideTimeout: 30_000,
        },
        id: expect.any(String) as string,
      });
    });
  });
});
