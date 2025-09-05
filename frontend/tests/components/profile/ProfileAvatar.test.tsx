import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ProfileAvatar from '../../../src/components/profile/ProfileAvatar.tsx';
import { afterEach, beforeEach } from 'vitest';
import { userEvent, UserEvent } from '@testing-library/user-event';
import { useImageUpload } from '../../../src/hooks/useImageUpload.tsx';

describe('ProfileAvatar', () => {
  const firstName = 'John';
  const lastName = 'Doe';
  const mockUseImageUpload: ReturnType<typeof useImageUpload> = {
    selectedFile: undefined,
    dragActive: false,
    isValidationError: false,
    validationErrors: [],
    handleChange: vi.fn(),
    handleDrag: vi.fn(),
    handleDrop: vi.fn(),
    handleCancel: vi.fn(),
  };

  const inputLabel = 'upload avatar';

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Not Edited', () => {
    it('Should not render input element', () => {
      // Given
      render(
        <ProfileAvatar
          firstName={firstName}
          lastName={lastName}
          imageUpload={mockUseImageUpload}
        />
      );

      // When
      const inputElement = screen.queryByLabelText(inputLabel);

      // Then
      expect(inputElement).not.toBeInTheDocument();
    });
  });

  describe('Edited', () => {
    let user: UserEvent;
    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });

    beforeEach(() => {
      user = userEvent.setup();
    });

    it('Should render input element', () => {
      // Given
      render(
        <ProfileAvatar
          firstName={firstName}
          lastName={lastName}
          imageUpload={mockUseImageUpload}
          isEdited
        />
      );

      // When
      const inputElement = screen.getByLabelText(inputLabel);

      // Then
      expect(inputElement).toBeInTheDocument();
    });

    it('Should allow to upload file by click', async () => {
      // Given
      render(
        <ProfileAvatar
          firstName={firstName}
          imageUpload={mockUseImageUpload}
          lastName={lastName}
          isEdited
        />
      );
      const inputElement = screen.getByLabelText(inputLabel);

      // When
      await user.upload(inputElement, file);

      // Then
      expect(mockUseImageUpload.handleChange).toHaveBeenCalledOnce();
      expect(mockUseImageUpload.handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            files: expect.objectContaining({
              length: 1,
              '0': file,
            }) as FileList,
          }) as HTMLInputElement,
        })
      );
    });

    it('Should allow to upload file by drag and drop', async () => {
      // Given
      render(
        <ProfileAvatar
          firstName={firstName}
          lastName={lastName}
          imageUpload={mockUseImageUpload}
          isEdited
        />
      );
      const inputElement = screen.getByLabelText(inputLabel);

      // When
      fireEvent.drop(inputElement, { dataTransfer: { files: [file] } });

      // Then
      await waitFor(() => {
        expect(mockUseImageUpload.handleDrop).toHaveBeenCalledOnce();
        expect(mockUseImageUpload.handleDrop).toHaveBeenCalledWith(
          expect.objectContaining({
            dataTransfer: {
              files: [file],
            },
          })
        );
      });
    });
  });
});
