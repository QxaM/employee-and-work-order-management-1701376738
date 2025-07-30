import { afterEach, beforeEach, describe, MockInstance } from 'vitest';

import authReducer, { login, logout } from '../../src/store/authSlice';
import { api } from '../../src/store/apiSlice.ts';
import { setupStore } from '../../src/store';
import { waitFor } from '@testing-library/react';
import { ActionCreatorWithoutPayload } from '@reduxjs/toolkit';

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

describe('AuthSlice', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();

    vi.stubGlobal('localStorage', localStorageMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Should handle initial state', () => {
    // Given
    const initialState = {
      token: undefined,
    };

    // When
    const state = authReducer(undefined, { type: 'unknown' });

    // Then
    expect(state).toEqual(initialState);
  });

  it('Should handle login action', () => {
    // Given
    const initialState = {
      token: undefined,
    };
    const token = '12345';

    // When
    const resultState = authReducer(initialState, login({ token }));

    // Then
    expect(resultState.token).toBe(token);
    expect(localStorageMock.setItem).toHaveBeenCalledOnce();
    expect(localStorageMock.setItem).toHaveBeenCalledWith('token', token);
  });

  it('Should handle login action with empty token', () => {
    // Given
    const initialState = {
      token: undefined,
    };

    // When
    const resultState = authReducer(initialState, login({ token: undefined }));

    // Then
    expect(resultState.token).toBe(undefined);
    expect(localStorageMock.removeItem).toHaveBeenCalledOnce();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
  });

  it('Should handle logout action', () => {
    // Given
    const initialState = {
      token: '12345',
    };

    // When
    const resultState = authReducer(initialState, logout());

    // Then
    expect(resultState.token).toBe(undefined);
    expect(localStorageMock.removeItem).toHaveBeenCalledOnce();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
  });

  describe('Auth listener', () => {
    let resetApyStateSpy: MockInstance<
      ActionCreatorWithoutPayload<`${string}/resetApiState`>
    >;
    let store: ReturnType<typeof setupStore>;

    beforeEach(() => {
      vi.resetAllMocks();
      resetApyStateSpy = vi.spyOn(api.util, 'resetApiState');

      store = setupStore();
    });

    it('should dispatch login listener action', async () => {
      // Given

      // When
      store.dispatch(login({ token: '12345' }));

      // Then
      await waitFor(() => {
        expect(resetApyStateSpy).toHaveBeenCalledOnce();
      });
    });

    it('should dispatch login listener action', async () => {
      // Given

      // When
      store.dispatch(logout());

      // Then
      await waitFor(() => {
        expect(resetApyStateSpy).toHaveBeenCalledOnce();
      });
    });
  });
});
