import { beforeAll, describe, it } from 'vitest';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { registerModal } from '../../src/store/modalSlice.ts';
import { renderWithProviders } from '../test-utils.tsx';
import DialogManager from '../../src/components/DialogManager.tsx';

describe('Dialog Manager', () => {
  beforeAll(() => {
    const modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal');
    document.body.appendChild(modalRoot);
  });

  it('Should render nothing initially', () => {
    // Given

    // When
    renderWithProviders(<DialogManager />);

    // Then
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('Should render one dialog', async () => {
    // Given
    const { store } = renderWithProviders(<DialogManager />);

    // When
    act(() => {
      store.dispatch(
        registerModal({
          id: 'modal-1',
          content: {
            message: 'Test message 1',
          },
        })
      );
    });

    // Then
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });
  });

  it('Should deregister dialog when closed', async () => {
    // Given
    const { store } = renderWithProviders(<DialogManager />);
    act(() => {
      store.dispatch(
        registerModal({
          id: 'modal-1',
          content: {
            message: 'Test message 1',
          },
        })
      );
    });

    // When
    const closeButtonLabel = '\u2715';
    const closeButton = await screen.findByRole('button', {
      name: new RegExp(closeButtonLabel, 'i'),
    });
    fireEvent.click(closeButton);

    // Then
    await waitFor(() => {
      expect(store.getState().modal.modals).toHaveLength(0);
    });
  });

  it('Should render 5 dialogs', async () => {
    // Given
    const { store } = renderWithProviders(<DialogManager />);

    // When
    act(() => {
      Array(5)
        .fill(0)
        .forEach((_, index) => {
          store.dispatch(
            registerModal({
              id: `modal-${index}`,
              content: {
                message: `Test message ${index}`,
              },
            })
          );
        });
    });

    // Then
    await waitFor(() => {
      expect(screen.getAllByRole('dialog')).toHaveLength(5);
    });
  });

  it('Should render 5 dialogs if more were registered', async () => {
    // Given
    const { store } = renderWithProviders(<DialogManager />);

    // When
    act(() => {
      Array(6)
        .fill(0)
        .forEach((_, index) => {
          store.dispatch(
            registerModal({
              id: `modal-${index}`,
              content: {
                message: `Test message ${index}`,
              },
            })
          );
        });
    });

    // Then
    await waitFor(() => {
      expect(screen.getAllByRole('dialog')).not.toHaveLength(6);
      expect(screen.getAllByRole('dialog')).toHaveLength(5);
    });
  });
});
