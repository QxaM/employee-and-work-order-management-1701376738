import {
  createListenerMiddleware,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { api } from './apiSlice.ts';

export interface AuthState {
  token: string | undefined;
}

const initialState: AuthState = {
  token: undefined,
};

/**
 * Redux slice for managing authentication state.
 *
 * - Stores the token in localStorage on login.
 * - Removes the token from localStorage on logout.
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Logs the user in by updating the token. Can also clean the token if `undefined` token is
     * provided.
     */
    login: (state, action: PayloadAction<AuthState>) => {
      if (action.payload.token) {
        localStorage.setItem('token', action.payload.token);
      } else {
        localStorage.removeItem('token');
      }
      state.token = action.payload.token;
    },
    /**
     * Logs the user out by clearing the token.
     */
    logout: (state) => {
      localStorage.removeItem('token');
      state.token = undefined;
    },
  },
});

export const authListenerMiddleware = createListenerMiddleware();
authListenerMiddleware.startListening({
  actionCreator: authSlice.actions.logout,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(api.util.resetApiState());
  },
});
authListenerMiddleware.startListening({
  actionCreator: authSlice.actions.login,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(api.util.resetApiState());
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
