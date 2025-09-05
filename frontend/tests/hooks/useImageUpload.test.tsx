import { beforeEach, describe, MockInstance } from 'vitest';
import * as validationModule from '../../src/utils/validators.ts';
import { useImageUpload } from '../../src/hooks/useImageUpload.tsx';
import { act, renderHook } from '@testing-library/react';
import { ChangeEvent, DragEvent } from 'react';

describe('useImageUpload', () => {
  const mockRevokeObjectURL = vi.fn();
  let mockValidateFile: MockInstance<
    (file: File) => { result: boolean; errors: string[] }
  >;

  beforeEach(() => {
    vi.resetAllMocks();

    mockValidateFile = vi
      .spyOn(validationModule, 'validateFile')
      .mockReturnValue({
        result: true,
        errors: [],
      });
    global.URL.createObjectURL = vi
      .fn()
      .mockImplementation((file: File) => file.name);
    global.URL.revokeObjectURL = mockRevokeObjectURL;
  });

  describe('handleFile', () => {
    const file = new File([''], 'test.png', { type: 'image/png' });

    it('Should handle file successfully, after default state', () => {
      // Given
      const event = {
        preventDefault: vi.fn(),
        currentTarget: {
          files: [file],
        },
      };

      const { result } = renderHook(() => useImageUpload());

      // When
      act(() => {
        result.current.handleChange(
          event as unknown as ChangeEvent<HTMLInputElement>
        );
      });

      // Then
      const currentFile = result.current.selectedFile;
      expect(currentFile).toBeDefined();
      expect(currentFile?.file).toBe(file);
      expect(currentFile?.preview).toBe(file.name);
      expect(currentFile?.name).toBe(file.name);
      expect(currentFile?.size).toBe(file.size);
    });

    it('Should handle file successfully, after file is successful', () => {
      // Given
      const event = {
        preventDefault: vi.fn(),
        currentTarget: {
          files: [file],
        },
      };

      const { result } = renderHook(() => useImageUpload());
      act(() => {
        result.current.handleChange(
          event as unknown as ChangeEvent<HTMLInputElement>
        );
      });

      // When
      const newFile = new File(['test2'], 'test2.png', { type: 'image/png' });
      const newEvent = {
        preventDefault: vi.fn(),
        currentTarget: {
          files: [newFile],
        },
      };
      act(() => {
        result.current.handleChange(
          newEvent as unknown as ChangeEvent<HTMLInputElement>
        );
      });

      // Then
      const currentFile = result.current.selectedFile;
      expect(currentFile).toBeDefined();
      expect(currentFile?.file).toBe(newFile);
      expect(currentFile?.preview).toBe(newFile.name);
      expect(currentFile?.name).toBe(newFile.name);
      expect(currentFile?.size).toBe(newFile.size);
    });

    it('Should handle file successfully, after file is not valid', () => {
      // Given
      const event = {
        preventDefault: vi.fn(),
        currentTarget: {
          files: [file],
        },
      };

      const { result } = renderHook(() => useImageUpload());
      vi.spyOn(validationModule, 'validateFile').mockReturnValueOnce({
        result: false,
        errors: ['test error'],
      });
      act(() => {
        result.current.handleChange(
          event as unknown as ChangeEvent<HTMLInputElement>
        );
      });

      // When
      const newFile = new File(['test2'], 'test2.png', { type: 'image/png' });
      const newEvent = {
        preventDefault: vi.fn(),
        currentTarget: {
          files: [newFile],
        },
      };
      vi.spyOn(validationModule, 'validateFile').mockReturnValue({
        result: true,
        errors: [],
      });
      act(() => {
        result.current.handleChange(
          newEvent as unknown as ChangeEvent<HTMLInputElement>
        );
      });

      // Then
      const currentFile = result.current.selectedFile;
      expect(currentFile).toBeDefined();
      expect(currentFile?.file).toBe(newFile);
      expect(currentFile?.preview).toBe(newFile.name);
      expect(currentFile?.name).toBe(newFile.name);
      expect(currentFile?.size).toBe(newFile.size);
    });

    describe('Validation failure', () => {
      const testError = 'Test error';

      beforeEach(() => {
        vi.spyOn(validationModule, 'validateFile').mockReturnValue({
          result: false,
          errors: [testError],
        });
      });

      it('Should handle invalid file, after default state', () => {
        // Given
        const event = {
          preventDefault: vi.fn(),
          currentTarget: {
            files: [file],
          },
        };

        const { result } = renderHook(() => useImageUpload());

        // When
        act(() => {
          result.current.handleChange(
            event as unknown as ChangeEvent<HTMLInputElement>
          );
        });

        // Then
        const currentFile = result.current.selectedFile;
        expect(currentFile).toBeUndefined();

        const isError = result.current.isValidationError;
        expect(isError).toBe(true);
        const validationErrors = result.current.validationErrors;
        expect(validationErrors).toHaveLength(1);
        expect(validationErrors).toContain(testError);
      });

      it('Should handle invalid file, after file is successful', () => {
        // Given
        const event = {
          preventDefault: vi.fn(),
          currentTarget: {
            files: [file],
          },
        };

        const { result } = renderHook(() => useImageUpload());
        vi.spyOn(validationModule, 'validateFile').mockReturnValueOnce({
          result: true,
          errors: [],
        });
        act(() => {
          result.current.handleChange(
            event as unknown as ChangeEvent<HTMLInputElement>
          );
        });

        // When
        vi.spyOn(validationModule, 'validateFile').mockReturnValue({
          result: false,
          errors: [testError],
        });
        const newFile = new File(['test2'], 'test2.png', { type: 'image/png' });
        const newEvent = {
          preventDefault: vi.fn(),
          currentTarget: {
            files: [newFile],
          },
        };
        act(() => {
          result.current.handleChange(
            newEvent as unknown as ChangeEvent<HTMLInputElement>
          );
        });

        // Then
        const currentFile = result.current.selectedFile;
        expect(currentFile).toBeUndefined();

        const isError = result.current.isValidationError;
        expect(isError).toBe(true);
        const validationErrors = result.current.validationErrors;
        expect(validationErrors).toHaveLength(1);
        expect(validationErrors).toContain(testError);
      });

      it('Should handle invalid file, after file is not valid', () => {
        // Given
        const event = {
          preventDefault: vi.fn(),
          currentTarget: {
            files: [file],
          },
        };

        const { result } = renderHook(() => useImageUpload());
        act(() => {
          result.current.handleChange(
            event as unknown as ChangeEvent<HTMLInputElement>
          );
        });

        // When
        const newFile = new File(['test2'], 'test2.png', { type: 'image/png' });
        const newEvent = {
          preventDefault: vi.fn(),
          currentTarget: {
            files: [newFile],
          },
        };
        act(() => {
          result.current.handleChange(
            newEvent as unknown as ChangeEvent<HTMLInputElement>
          );
        });

        // Then
        const currentFile = result.current.selectedFile;
        expect(currentFile).toBeUndefined();

        const isError = result.current.isValidationError;
        expect(isError).toBe(true);
        const validationErrors = result.current.validationErrors;
        expect(validationErrors).toHaveLength(1);
        expect(validationErrors).toContain(testError);
      });
    });
  });

  describe('handleChange', () => {
    const file = new File([''], 'test.png', { type: 'image/png' });

    it('Should handle event', () => {
      // Given
      const event = {
        preventDefault: vi.fn(),
        currentTarget: {
          files: [file],
        },
      };

      const { result } = renderHook(() => useImageUpload());

      // When
      act(() => {
        result.current.handleChange(
          event as unknown as ChangeEvent<HTMLInputElement>
        );
      });

      // Then
      expect(mockValidateFile).toHaveBeenCalledOnce();
      expect(mockValidateFile).toHaveBeenCalledWith(file);
    });

    it('Should handle empty event', () => {
      // Given
      const event = {
        preventDefault: vi.fn(),
        currentTarget: {},
      };

      const { result } = renderHook(() => useImageUpload());

      // When
      act(() => {
        result.current.handleChange(
          event as unknown as ChangeEvent<HTMLInputElement>
        );
      });

      // Then
      expect(mockValidateFile).not.toHaveBeenCalled();
    });
  });

  describe('handleDrag', () => {
    it('Should handle drag enter', () => {
      // Given
      const event: Partial<DragEvent<HTMLInputElement>> = {
        type: 'dragenter',
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      };
      const { result } = renderHook(() => useImageUpload());

      // When
      act(() => {
        result.current.handleDrag(event as DragEvent<HTMLInputElement>);
      });

      // Then
      const drag = result.current.dragActive;
      expect(drag).toBe(true);
    });

    it('Should handle drag over', () => {
      // Given
      const event: Partial<DragEvent<HTMLInputElement>> = {
        type: 'dragover',
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      };
      const { result } = renderHook(() => useImageUpload());

      // When
      act(() => {
        result.current.handleDrag(event as DragEvent<HTMLInputElement>);
      });

      // Then
      const drag = result.current.dragActive;
      expect(drag).toBe(true);
    });

    it('Should handle drag leave', () => {
      // Given
      const event: Partial<DragEvent<HTMLInputElement>> = {
        type: 'dragover',
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      };
      const { result } = renderHook(() => useImageUpload());
      act(() => {
        result.current.handleDrag(event as DragEvent<HTMLInputElement>);
      });

      // When
      const leaveEvent: Partial<DragEvent<HTMLInputElement>> = {
        type: 'dragleave',
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      };
      act(() => {
        result.current.handleDrag(leaveEvent as DragEvent<HTMLInputElement>);
      });

      // Then
      const drag = result.current.dragActive;
      expect(drag).toBe(false);
    });
  });

  describe('handleDrop', () => {
    const file = new File([''], 'test.png', { type: 'image/png' });

    it('Should handle drag state', () => {
      // Given
      const event: Partial<DragEvent<HTMLInputElement>> = {
        type: 'dragover',
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      };
      const { result } = renderHook(() => useImageUpload());
      act(() => {
        result.current.handleDrag(event as DragEvent<HTMLInputElement>);
      });

      // When
      const dropEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {
          files: [file],
        },
      };
      act(() => {
        result.current.handleDrop(
          dropEvent as unknown as DragEvent<HTMLInputElement>
        );
      });

      // Then
      const drag = result.current.dragActive;
      expect(drag).toBe(false);
    });

    it('Should handle event', () => {
      // Given
      const dropEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {
          files: [file],
        },
      };
      const { result } = renderHook(() => useImageUpload());

      // When
      act(() => {
        result.current.handleDrop(
          dropEvent as unknown as DragEvent<HTMLInputElement>
        );
      });

      // Then
      expect(mockValidateFile).toHaveBeenCalledOnce();
      expect(mockValidateFile).toHaveBeenCalledWith(file);
    });

    it('Should handle empty event', () => {
      // Given
      const dropEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {
          files: [],
        },
      };
      const { result } = renderHook(() => useImageUpload());

      // When
      act(() => {
        result.current.handleDrop(
          dropEvent as unknown as DragEvent<HTMLInputElement>
        );
      });

      // Then
      expect(mockValidateFile).not.toHaveBeenCalled();
    });
  });

  describe('handleCancel', () => {
    const file = new File([''], 'test.png', { type: 'image/png' });

    it('Should reset selected file', () => {
      // Given
      const event = {
        preventDefault: vi.fn(),
        currentTarget: {
          files: [file],
        },
      };

      const { result } = renderHook(() => useImageUpload());
      act(() => {
        result.current.handleChange(
          event as unknown as ChangeEvent<HTMLInputElement>
        );
      });

      // When
      act(() => {
        result.current.handleCancel();
      });

      // Then
      const selectedFile = result.current.selectedFile;
      expect(selectedFile).toBeUndefined();
    });

    it('Should reset validation error', () => {
      // Given
      const event = {
        preventDefault: vi.fn(),
        currentTarget: {
          files: [file],
        },
      };
      vi.spyOn(validationModule, 'validateFile').mockReturnValue({
        result: false,
        errors: ['test error'],
      });

      const { result } = renderHook(() => useImageUpload());
      act(() => {
        result.current.handleChange(
          event as unknown as ChangeEvent<HTMLInputElement>
        );
      });

      // When
      act(() => {
        result.current.handleCancel();
      });

      // Then
      const isError = result.current.isValidationError;
      expect(isError).toBe(false);
    });

    it('Should reset validation error list', () => {
      // Given
      const event = {
        preventDefault: vi.fn(),
        currentTarget: {
          files: [file],
        },
      };
      vi.spyOn(validationModule, 'validateFile').mockReturnValue({
        result: false,
        errors: ['test error'],
      });

      const { result } = renderHook(() => useImageUpload());
      act(() => {
        result.current.handleChange(
          event as unknown as ChangeEvent<HTMLInputElement>
        );
      });

      // When
      act(() => {
        result.current.handleCancel();
      });

      // Then
      const validationErrors = result.current.validationErrors;
      expect(validationErrors).toHaveLength(0);
    });
  });

  describe('side effects', () => {
    it('Should unmount previews when element is unmounted', () => {
      // Given
      const file = new File([''], 'test.png', { type: 'image/png' });
      const event = {
        preventDefault: vi.fn(),
        currentTarget: {
          files: [file],
        },
      };

      const { result, unmount } = renderHook(() => useImageUpload());
      act(() => {
        result.current.handleChange(
          event as unknown as ChangeEvent<HTMLInputElement>
        );
      });

      // When
      unmount();

      // Then
      expect(mockRevokeObjectURL).toHaveBeenCalledOnce();
      expect(mockRevokeObjectURL).toHaveBeenCalledWith(file.name);
    });

    it('Should not unmount previews when files were not uploaded', () => {
      // Given
      const { unmount } = renderHook(() => useImageUpload());

      // When
      unmount();

      // Then
      expect(mockRevokeObjectURL).not.toHaveBeenCalled();
    });
  });
});
