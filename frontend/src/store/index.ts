import { combineReducers, configureStore } from '@reduxjs/toolkit';
import modalReducer from './modalSlice';
import authSlice from './authSlice';

const rootReducer = combineReducers({
  modal: modalReducer,
  auth: authSlice,
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
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
