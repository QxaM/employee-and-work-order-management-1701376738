import { describe, expect } from 'vitest';

import { ModalData } from '@/types/ModalTypes.ts';
import modalReducer, { registerModal, removeModal } from '@/store/modalSlice';

describe('ModalSlice Tests', () => {
  it('Should handle initial state', () => {
    // Given
    const initialState = {
      modals: [] as ModalData[],
    };

    // When
    const state = modalReducer(undefined, { type: 'unknown' });

    // Then
    expect(state).toEqual(initialState);
  });

  it('Should handle add modal', () => {
    // Given
    const initialState = {
      modals: [] as ModalData[],
    };
    const newModal: ModalData = {
      id: 'modal-1',
      content: { message: 'Test message' },
    };

    // When
    const resultState = modalReducer(initialState, registerModal(newModal));

    // Then
    expect(resultState.modals).toHaveLength(1);
    expect(resultState.modals[0].id).toBe('modal-1');
    expect(resultState.modals[0].content.message).toBe('Test message');
  });

  it('Should handle remove modal', () => {
    // Given
    const initialState = {
      modals: [
        {
          id: 'modal-1',
          content: { message: 'Test message 1' },
        },
        {
          id: 'modal-2',
          content: { message: 'Test message 2' },
        },
      ] as ModalData[],
    };

    // When
    const resultState = modalReducer(
      initialState,
      removeModal(initialState.modals[1].id)
    );

    // Then
    expect(resultState.modals).toHaveLength(1);
    expect(resultState.modals[0].id).toBe('modal-1');
    expect(resultState.modals[0].content.message).toBe('Test message 1');
  });
});
