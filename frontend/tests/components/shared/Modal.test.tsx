import { beforeAll, describe, it } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import Modal from '@/components/shared/Modal.tsx';

const TEST_MESSAGE = 'Test message';

describe('Modal Tests', () => {
  beforeAll(() => {
    const modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal');
    document.body.appendChild(modalRoot);
  });
  describe('Rendering', () => {
    it('Opens and displays the message when Modal is created', () => {
      // Given

      // When
      render(<Modal index={1} message={TEST_MESSAGE} onClose={vi.fn()} />);

      // Then
      expect(screen.getByText(TEST_MESSAGE)).toBeInTheDocument();
    });

    it('Closes when the close button is clicked', async () => {
      // Given
      const onCloseMock = vi.fn();
      render(<Modal index={1} message={TEST_MESSAGE} onClose={onCloseMock} />);

      // When
      const closeButtonLabel = '\u2715';
      const closeButton = screen.getByRole('button', {
        name: new RegExp(closeButtonLabel, 'i'),
      });
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
      render(<Modal index={1} message={TEST_MESSAGE} onClose={onCloseMock} />);
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
        <Modal
          index={1}
          message={TEST_MESSAGE}
          hideTimeout={5_000}
          onClose={onCloseMock}
        />
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

  describe('Modal style changes', () => {
    it('Should apply "info" style by default', () => {
      // Given
      const onCloseMock = vi.fn();
      render(<Modal index={1} message={TEST_MESSAGE} onClose={onCloseMock} />);

      // When
      const dialog = screen.getByRole('dialog');

      // Then
      expect(dialog).toHaveClass('bg-qxam-accent-extreme-light');
      expect(dialog).toHaveClass('text-qxam-accent-neutral-dark');
      expect(dialog).toHaveClass('border-qxam-accent-lighter');
    });

    it('Should apply "success" style', () => {
      // Given
      const onCloseMock = vi.fn();
      render(
        <Modal
          index={1}
          message={TEST_MESSAGE}
          onClose={onCloseMock}
          type={'success'}
        />
      );

      // When
      const dialog = screen.getByRole('dialog');

      // Then
      expect(dialog).toHaveClass('bg-qxam-success-extreme-light');
      expect(dialog).toHaveClass('text-qxam-success-darkest');
      expect(dialog).toHaveClass('border-qxam-success-lighter');
    });

    it('Should apply "error" style', () => {
      // Given
      const onCloseMock = vi.fn();
      render(
        <Modal
          index={1}
          message={TEST_MESSAGE}
          onClose={onCloseMock}
          type={'error'}
        />
      );

      // When
      const dialog = screen.getByRole('dialog');

      // Then
      expect(dialog).toHaveClass('bg-qxam-error-extreme-light');
      expect(dialog).toHaveClass('text-qxam-error-darkest');
      expect(dialog).toHaveClass('border-qxam-error-lighter');
    });
  });
});
