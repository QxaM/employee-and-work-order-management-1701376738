import { renderHookWithProviders } from '../test-utils.tsx';
import { useFormNotifications } from '../../src/hooks/useFormNotifications.tsx';
import { afterEach, beforeEach, expect } from 'vitest';

const defaultSuccess = 'Data have been submitted successfully!';
const defaultError = 'Error while submitting data!';

describe('useFormNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Success', () => {
    it('Should dispatch correct success event on success', () => {
      // Given
      const submit = {
        success: {
          status: true,
          message: 'Test success message',
        },
      };

      // When
      const { store } = renderHookWithProviders(() => {
        useFormNotifications(submit);
      });

      // Then
      const modalState = store.getState().modal;
      expect(modalState.modals).toHaveLength(1);
      expect(modalState.modals[0].content).toStrictEqual({
        message: submit.success.message,
        type: 'success',
      });
    });

    it('Should dispatch success event with default message', () => {
      // Given
      const submit = {
        success: {
          status: true,
        },
      };

      // When
      const { store } = renderHookWithProviders(() => {
        useFormNotifications(submit);
      });

      // Then
      const modalState = store.getState().modal;
      expect(modalState.modals).toHaveLength(1);
      expect(modalState.modals[0].content).toStrictEqual({
        message: defaultSuccess,
        type: 'success',
      });
    });

    it('Should run onSuccess if it exists', () => {
      // Given
      const mockOnSuccess = vi.fn();
      const submit = {
        success: {
          status: true,
          message: 'Test success message',
        },
        onSuccess: mockOnSuccess,
      };

      // When
      renderHookWithProviders(() => {
        useFormNotifications(submit);
      });

      // Then
      expect(mockOnSuccess).toHaveBeenCalledOnce();
    });

    it('Should not run onSuccess if it exists, but not success', () => {
      // Given
      const mockOnSuccess = vi.fn();
      const submit = {
        success: {
          status: false,
          message: 'Test success message',
        },
        error: {
          status: false,
          message: 'Test error message',
        },
        onSuccess: mockOnSuccess,
      };

      // When
      renderHookWithProviders(() => {
        useFormNotifications(submit);
      });

      // Then
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });

  describe('Error', () => {
    it('Should dispatch correct error event on error', () => {
      // Given
      const submit = {
        success: {
          status: false,
          message: 'Test success message',
        },
        error: {
          status: true,
          message: 'Test error message',
        },
      };

      // When
      const { store } = renderHookWithProviders(() => {
        useFormNotifications(submit);
      });

      // Then
      const modalState = store.getState().modal;
      expect(modalState.modals).toHaveLength(1);
      expect(modalState.modals[0].content).toStrictEqual({
        message: submit.error.message,
        type: 'error',
      });
    });

    it('Should dispatch error event with default message', () => {
      // Given
      const submit = {
        success: {
          status: false,
        },
        error: {
          status: true,
        },
      };

      // When
      const { store } = renderHookWithProviders(() => {
        useFormNotifications(submit);
      });

      // Then
      const modalState = store.getState().modal;
      expect(modalState.modals).toHaveLength(1);
      expect(modalState.modals[0].content).toStrictEqual({
        message: defaultError,
        type: 'error',
      });
    });
  });
});
