import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  token: string | undefined;
}

const initialState: AuthState = {
  token: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthState>) => {
      if (action.payload.token) {
        localStorage.setItem('token', action.payload.token);
      } else {
        localStorage.removeItem('token');
      }
      state.token = action.payload.token;
    },
    logout: (state) => {
      localStorage.removeItem('token');
      state.token = undefined;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
