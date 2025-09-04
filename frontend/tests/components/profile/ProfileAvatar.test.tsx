import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ProfileAvatar from '../../../src/components/profile/ProfileAvatar.tsx';
import { afterEach, beforeEach } from 'vitest';
import { userEvent, UserEvent } from '@testing-library/user-event';

describe('ProfileAvatar', () => {
  const firstName = 'John';
  const lastName = 'Doe';

  const inputLabel = 'upload avatar';

  describe('Not Edited', () => {
    it('Should not render input element', () => {
      // Given
      render(<ProfileAvatar firstName={firstName} lastName={lastName} />);

      // When
      const inputElement = screen.queryByLabelText(inputLabel);

      // Then
      expect(inputElement).not.toBeInTheDocument();
    });
  });

  describe('Edited', () => {
    let user: UserEvent;
    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
    const mockCreateUrl = vi.fn();

    beforeEach(() => {
      vi.resetAllMocks();
      user = userEvent.setup();

      global.URL.createObjectURL = mockCreateUrl;
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('Should render input element', () => {
      // Given
      render(
        <ProfileAvatar firstName={firstName} lastName={lastName} isEdited />
      );

      // When
      const inputElement = screen.getByLabelText(inputLabel);

      // Then
      expect(inputElement).toBeInTheDocument();
    });

    it('Should allow to upload file by click', async () => {
      // Given
      render(
        <ProfileAvatar firstName={firstName} lastName={lastName} isEdited />
      );
      const inputElement = screen.getByLabelText(inputLabel);

      // When
      await user.upload(inputElement, file);

      // Then
      expect(mockCreateUrl).toHaveBeenCalledOnce();
      expect(mockCreateUrl).toHaveBeenCalledWith(file);

      const input = inputElement.firstChild as HTMLInputElement;
      expect(input.files).toHaveLength(1);
      expect(input.files?.[0]).toBe(file);

      const filenameElement = screen.getByText(file.name);
      const filesizeElement = screen.getByText(file.size, { exact: true });
      expect(filenameElement).toBeInTheDocument();
      expect(filesizeElement).toBeInTheDocument();
    });

    it('Should allow to upload file by drag and drop', async () => {
      // Given
      render(
        <ProfileAvatar firstName={firstName} lastName={lastName} isEdited />
      );
      const inputElement = screen.getByLabelText(inputLabel);

      // When
      fireEvent.drop(inputElement, { dataTransfer: { files: [file] } });

      // Then
      await waitFor(() => {
        expect(mockCreateUrl).toHaveBeenCalledOnce();
        expect(mockCreateUrl).toHaveBeenCalledWith(file);

        const filenameElement = screen.getByText(file.name);
        const filesizeElement = screen.getByText(file.size, { exact: true });
        expect(filenameElement).toBeInTheDocument();
        expect(filesizeElement).toBeInTheDocument();
      });
    });

    it('Should unmount previews when element is unmounted', async () => {
      // Given
      const testPreview = 'test-preview';
      const mockRevokeUrl = vi.fn();
      URL.createObjectURL = vi.fn().mockReturnValue(testPreview);
      URL.revokeObjectURL = mockRevokeUrl;

      const { unmount } = render(
        <ProfileAvatar firstName={firstName} lastName={lastName} isEdited />
      );

      const inputElement = screen.getByLabelText(inputLabel);
      await user.upload(inputElement, file);

      // When
      unmount();

      // Then
      expect(mockRevokeUrl).toHaveBeenCalledOnce();
      expect(mockRevokeUrl).toHaveBeenCalledWith('test-preview');
    });

    it('Should not unmount previews when files were not uploaded', () => {
      // Given
      const testPreview = 'test-preview';
      const mockRevokeUrl = vi.fn();
      URL.createObjectURL = vi.fn().mockReturnValue(testPreview);
      URL.revokeObjectURL = mockRevokeUrl;

      const { unmount } = render(
        <ProfileAvatar firstName={firstName} lastName={lastName} isEdited />
      );

      // When
      unmount();

      // Then
      expect(mockRevokeUrl).not.toHaveBeenCalled();
    });
  });
});
