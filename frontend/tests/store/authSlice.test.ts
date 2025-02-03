import { afterEach, beforeEach, describe } from 'vitest';

import authReducer, { login, logout } from '@/store/authSlice';

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
});
