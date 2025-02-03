import { combineReducers, configureStore } from '@reduxjs/toolkit';
import modalReducer from './modalSlice';

const rootReducer = combineReducers({
  modal: modalReducer,
});

export const setupStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
