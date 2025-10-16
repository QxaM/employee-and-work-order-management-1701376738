import { combineReducers, configureStore } from '@reduxjs/toolkit';
import modalReducer from './modalSlice';
import authReducer, { authListenerMiddleware } from './authSlice';
import profileImageReducer from './profileImageSlice';
import { api } from './apiSlice.ts';

const rootReducer = combineReducers({
  modal: modalReducer,
  auth: authReducer,
  profileImage: profileImageReducer,
  [api.reducerPath]: api.reducer,
});

/**
 * Configures the Redux store with an optional preloaded state.
 *
 * @param preloadedState - Initial state for the store.
 * @returns The configured Redux store.
 */
export const setupStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(api.middleware)
        .concat(authListenerMiddleware.middleware),
  });
};

const storedToken = localStorage.getItem('token');
const preloadedState = storedToken ? { auth: { token: storedToken } } : {};
export const store = setupStore(preloadedState);

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
