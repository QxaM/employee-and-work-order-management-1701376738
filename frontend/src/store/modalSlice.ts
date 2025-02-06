import { ModalData } from '../types/ModalTypes.tsx';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ModalState {
  modals: ModalData[];
}

const initialState: ModalState = {
  modals: [],
};

/**
 * Redux slice for managing the state of modals.
 *
 * - Allows registering new modals in the store
 * - Allow for removing modals from the store by ID
 */
const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    /**
     * Registers a modal by adding it to the state.
     */
    registerModal: (state, action: PayloadAction<ModalData>) => {
      state.modals.push(action.payload);
    },
    /**
     * Removes a modal from the state using its ID.
     */
    removeModal: (state, action: PayloadAction<string>) => {
      state.modals = state.modals.filter(
        (modal) => modal.id !== action.payload
      );
    },
  },
});

export const { registerModal, removeModal } = modalSlice.actions;
export default modalSlice.reducer;
