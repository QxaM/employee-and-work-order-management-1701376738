import { ModalData } from '@/types/ModalTypes.ts';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModalState {
  modals: ModalData[];
}

const initialState: ModalState = {
  modals: [],
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    registerModal: (state, action: PayloadAction<ModalData>) => {
      state.modals.push(action.payload);
    },
    removeModal: (state, action: PayloadAction<string>) => {
      state.modals = state.modals.filter(
        (modal) => modal.id !== action.payload
      );
    },
  },
});

export const { registerModal, removeModal } = modalSlice.actions;
export default modalSlice.reducer;
