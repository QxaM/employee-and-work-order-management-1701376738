import { beforeAll, describe } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import ModalPage from '../../src/pages/ModalPage.tsx';

describe('Modal Page', () => {
  const title = 'Test title';
  const description = 'Test description';
  const closeButtonLabel = 'close dialog';

  beforeAll(() => {
    const modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal');
    document.body.appendChild(modalRoot);
  });

  it('Should contain correct elements - title, description, close button and children', () => {
    // Given
    const children = 'Test children';
    render(
      <ModalPage
        title={title}
        description={description}
        open
        onOpenChange={vi.fn()}
      >
        {children}
      </ModalPage>
    );

    // When
    const titleElement = screen.getByText(title, { exact: true });
    const descriptionElement = screen.getByText(description, { exact: true });
    const childrenElement = screen.getByText(children, { exact: true });
    const closeButton = screen.getByText(closeButtonLabel);

    // Then
    expect(titleElement).toBeInTheDocument();
    expect(descriptionElement).toBeInTheDocument();
    expect(childrenElement).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
  });

  it('Should close when clicking on close button', () => {
    // Given
    const mockClose = vi.fn();
    render(
      <ModalPage
        title={title}
        description={description}
        open
        onOpenChange={mockClose}
      />
    );
    const closeButton = screen.getByText(closeButtonLabel);

    // When
    fireEvent.click(closeButton);

    // Then
    expect(mockClose).toHaveBeenCalledOnce();
  });
});
