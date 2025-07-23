import { beforeAll, describe } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import ModalPage from '../../src/pages/ModalPage.tsx';

describe('Modal Page', () => {
  const backdropId = 'backdrop';
  const closeButtonLabel = 'close dialog';

  beforeAll(() => {
    const modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal');
    document.body.appendChild(modalRoot);
  });

  it('Should contain correct elements', () => {
    // Given
    render(<ModalPage onClose={vi.fn()} />);

    // When
    const backdrop = document.querySelector(`#${backdropId}`);
    const closeButton = screen.getByLabelText(closeButtonLabel);

    // Then
    expect(backdrop).not.toBeNull();
    expect(closeButton).toBeInTheDocument();
  });

  it('Should close when clicking on close button', () => {
    // Given
    const mockClose = vi.fn();
    render(<ModalPage onClose={mockClose} />);
    const backdrop = document.querySelector(`#${backdropId}`);

    // When
    if (backdrop) {
      fireEvent.click(backdrop);
    }

    // Then
    expect(mockClose).toHaveBeenCalledOnce();
  });

  it('Should close when clicking on backdrop', () => {
    // Given
    const mockClose = vi.fn();
    render(<ModalPage onClose={mockClose} />);
    const closeButton = screen.getByLabelText(closeButtonLabel);

    // When
    fireEvent.click(closeButton);

    // Then
    expect(mockClose).toHaveBeenCalledOnce();
  });
});
