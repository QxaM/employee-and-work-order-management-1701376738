import { beforeAll, describe, it } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import Modal from '@/components/shared/Modal.tsx';
import { createRef } from 'react';
import { ModalRefType } from '@/types/ModalTypes.ts';

const TEST_MESSAGE = 'Test message';

describe('Modal Tests', () => {
  beforeAll(() => {
    const modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal');
    document.body.appendChild(modalRoot);
  });
  describe('Rendering', () => {
    it('Should render nothing initially', () => {
      // Given

      // When
      render(<Modal message={TEST_MESSAGE} />);

      // Then
      expect(screen.queryByText(TEST_MESSAGE)).not.toBeInTheDocument();
    });

    it('Opens and displays the message when open is called', () => {
      // Given
      const ref = createRef<ModalRefType>();
      render(<Modal ref={ref} message={TEST_MESSAGE} />);

      // When
      act(() => {
        ref.current?.open();
      });

      // Then
      expect(screen.getByText(TEST_MESSAGE)).toBeInTheDocument();
    });

    it('Closes when the close button is clicked', async () => {
      // Given
      const ref = createRef<ModalRefType>();
      render(<Modal ref={ref} message={TEST_MESSAGE} />);
      act(() => {
        ref.current?.open();
      });

      // When
      const closeButtonLabel = '\u2715';
      const closeButton = screen.getByRole('button', {
        name: new RegExp(closeButtonLabel, 'i'),
      });
      fireEvent.click(closeButton);

      // Then
      await waitFor(() => {
        expect(screen.queryByText(TEST_MESSAGE)).not.toBeInTheDocument();
      });
    });

    it('Automatically hides after default 10s timeout', async () => {
      // Given
      vi.useFakeTimers();

      const ref = createRef<ModalRefType>();
      render(<Modal ref={ref} message={TEST_MESSAGE} />);
      act(() => {
        ref.current?.open();
      });
      expect(screen.getByText(TEST_MESSAGE)).toBeInTheDocument();

      // When
      act(() => {
        vi.advanceTimersByTime(10_000);
        vi.useRealTimers();
      });

      // Then
      await waitFor(() => {
        expect(screen.queryByText(TEST_MESSAGE)).not.toBeInTheDocument();
      });

      // Cleanup
      vi.useRealTimers();
    });

    it('Automatically hides after custom timeout', async () => {
      // Given
      vi.useFakeTimers();

      const ref = createRef<ModalRefType>();
      render(<Modal ref={ref} message={TEST_MESSAGE} hideTimeout={5_000} />);
      act(() => {
        ref.current?.open();
      });
      expect(screen.getByText(TEST_MESSAGE)).toBeInTheDocument();

      // When
      act(() => {
        vi.advanceTimersByTime(5_000);
        vi.useRealTimers();
      });

      // Then
      await waitFor(() => {
        expect(screen.queryByText(TEST_MESSAGE)).not.toBeInTheDocument();
      });

      // Cleanup
      vi.useRealTimers();
    });
  });

  describe('Modal style changes', () => {
    it('Should apply "info" style by default', () => {
      // Given
      const ref = createRef<ModalRefType>();
      render(<Modal ref={ref} message={TEST_MESSAGE} />);

      // When
      act(() => {
        ref.current?.open();
      });
      const dialog = screen.getByRole('dialog');

      // Then
      expect(dialog).toHaveClass('bg-qxam-accent-extreme-light');
      expect(dialog).toHaveClass('text-qxam-accent-neutral-dark');
      expect(dialog).toHaveClass('border-qxam-accent-lighter');
    });

    it('Should apply "success" style', () => {
      // Given
      const ref = createRef<ModalRefType>();
      render(<Modal ref={ref} message={TEST_MESSAGE} type="success" />);

      // When
      act(() => {
        ref.current?.open();
      });
      const dialog = screen.getByRole('dialog');

      // Then
      expect(dialog).toHaveClass('bg-qxam-success-extreme-light');
      expect(dialog).toHaveClass('text-qxam-success-darkest');
      expect(dialog).toHaveClass('border-qxam-success-lighter');
    });

    it('Should apply "error" style', () => {
      // Given
      const ref = createRef<ModalRefType>();
      render(<Modal ref={ref} message={TEST_MESSAGE} type="error" />);

      // When
      act(() => {
        ref.current?.open();
      });
      const dialog = screen.getByRole('dialog');

      // Then
      expect(dialog).toHaveClass('bg-qxam-error-extreme-light');
      expect(dialog).toHaveClass('text-qxam-error-darkest');
      expect(dialog).toHaveClass('border-qxam-error-lighter');
    });
  });
});
