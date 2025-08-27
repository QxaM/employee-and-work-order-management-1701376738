import { beforeAll, describe, it } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import ModalMessage from '../../../../src/components/shared/modal/ModalMessage.tsx';
import ModalProvider from '../../../../src/components/shared/modal/ModalProvider.tsx';
import { MODAL_TYPE } from '../../../../src/types/components/ModalTypes.tsx';

const TEST_MESSAGE = 'Test message';

describe('ModalMessage Tests', () => {
  beforeAll(() => {
    const modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal');
    document.body.appendChild(modalRoot);
  });

  describe('Rendering', () => {
    it('Opens and displays the message when ModalMessage is created', () => {
      // Given

      // When
      render(
        <ModalProvider>
          <ModalMessage index={1} message={TEST_MESSAGE} onClose={vi.fn()} />
        </ModalProvider>
      );

      // Then
      expect(screen.getByText(TEST_MESSAGE)).toBeInTheDocument();
    });

    it('Closes when the close button is clicked', async () => {
      // Given
      const onCloseMock = vi.fn();
      render(
        <ModalProvider>
          <ModalMessage
            index={1}
            message={TEST_MESSAGE}
            onClose={onCloseMock}
          />
        </ModalProvider>
      );

      // When
      const closeButton = screen.getByRole('button');
      fireEvent.click(closeButton);

      // Then
      await waitFor(() => {
        expect(screen.queryByText(TEST_MESSAGE)).not.toBeInTheDocument();
        expect(onCloseMock).toHaveBeenCalledOnce();
      });
    });

    it('Automatically hides after default 10s timeout', async () => {
      // Given
      vi.useFakeTimers();

      const onCloseMock = vi.fn();
      render(
        <ModalProvider>
          <ModalMessage
            index={1}
            message={TEST_MESSAGE}
            onClose={onCloseMock}
          />
        </ModalProvider>
      );
      expect(screen.getByText(TEST_MESSAGE)).toBeInTheDocument();

      // When
      act(() => {
        vi.advanceTimersByTime(10_000);
        vi.useRealTimers();
      });

      // Then
      await waitFor(() => {
        expect(screen.queryByText(TEST_MESSAGE)).not.toBeInTheDocument();
        expect(onCloseMock).toHaveBeenCalledOnce();
      });

      // Cleanup
      vi.useRealTimers();
    });

    it('Automatically hides after custom timeout', async () => {
      // Given
      vi.useFakeTimers();

      const onCloseMock = vi.fn();
      render(
        <ModalProvider>
          <ModalMessage
            index={1}
            message={TEST_MESSAGE}
            hideTimeout={5_000}
            onClose={onCloseMock}
          />
        </ModalProvider>
      );
      expect(screen.getByText(TEST_MESSAGE)).toBeInTheDocument();

      // When
      act(() => {
        vi.advanceTimersByTime(5_000);
        vi.useRealTimers();
      });

      // Then
      await waitFor(() => {
        expect(screen.queryByText(TEST_MESSAGE)).not.toBeInTheDocument();
        expect(onCloseMock).toHaveBeenCalledOnce();
      });

      // Cleanup
      vi.useRealTimers();
    });
  });

  describe('ModalMessage style changes', () => {
    const dataTestId = 'modal-message';

    it('Should apply "info" style by default', () => {
      // Given
      const onCloseMock = vi.fn();
      render(
        <ModalProvider>
          <ModalMessage
            index={1}
            message={TEST_MESSAGE}
            onClose={onCloseMock}
          />
        </ModalProvider>
      );

      // When
      const dialog = screen.getByTestId(dataTestId);

      // Then
      expect(dialog).toHaveClass(MODAL_TYPE.info.background);
      expect(dialog).toHaveClass(MODAL_TYPE.info.text);
      expect(dialog).toHaveClass(MODAL_TYPE.info.border);
    });

    it('Should apply "success" style', () => {
      // Given
      const onCloseMock = vi.fn();
      render(
        <ModalProvider>
          <ModalMessage
            index={1}
            message={TEST_MESSAGE}
            onClose={onCloseMock}
            type={'success'}
          />
        </ModalProvider>
      );

      // When
      const dialog = screen.getByTestId(dataTestId);

      // Then
      expect(dialog).toHaveClass(MODAL_TYPE.success.background);
      expect(dialog).toHaveClass(MODAL_TYPE.success.text);
      expect(dialog).toHaveClass(MODAL_TYPE.success.border);
    });

    it('Should apply "error" style', () => {
      // Given
      const onCloseMock = vi.fn();
      render(
        <ModalProvider>
          <ModalMessage
            index={1}
            message={TEST_MESSAGE}
            onClose={onCloseMock}
            type={'error'}
          />
        </ModalProvider>
      );

      // When
      const dialog = screen.getByTestId(dataTestId);

      // Then
      expect(dialog).toHaveClass(MODAL_TYPE.error.background);
      expect(dialog).toHaveClass(MODAL_TYPE.error.text);
      expect(dialog).toHaveClass(MODAL_TYPE.error.border);
    });
  });
});
