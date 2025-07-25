import { afterEach, beforeEach, describe, expect } from 'vitest';

import { login, useLoginUser } from '../../src/api/auth.ts';
import { LoginType, TokenType } from '../../src/types/AuthorizationTypes.ts';
import * as baseApiModule from '../../src/api/base.ts';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientWrapper as queryWrapper } from '../test-utils.tsx';

describe('Authorization tests', () => {
  const mockHandleFetchVoid = vi.fn();
  const mockHandleFetch = vi.fn();

  beforeEach(() => {
    mockHandleFetchVoid.mockRestore();
    mockHandleFetch.mockRestore();

    vi.spyOn(baseApiModule, 'handleFetchVoid').mockImplementation(
      mockHandleFetchVoid
    );
    vi.spyOn(baseApiModule, 'handleFetch').mockImplementation(mockHandleFetch);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Login', () => {
    const mockData: LoginType = {
      email: 'test@test.com',
      password: 'password123',
    };

    const mockReturnData: TokenType = {
      token: '12345',
      type: 'Bearer',
      expiresIn: 3600,
    };

    describe('loginUser', () => {
      it('Should login successfully', async () => {
        // Given
        mockHandleFetch.mockResolvedValue(mockReturnData);

        // When
        await expect(login({ data: mockData })).resolves.not.toThrow();

        // Then
        expect(mockHandleFetch).toHaveBeenCalledWith(
          expect.stringContaining('/login'),
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization:
                'Basic ' + btoa(mockData.email + ':' + mockData.password),
            },
          }),
          expect.any(String)
        );
      });

      it('Should handle API error', async () => {
        // Given
        const errorMessage =
          'Unauthorized to access this resource, login please';
        mockHandleFetch.mockRejectedValue(new Error(errorMessage));

        // When

        // Then
        await expect(login({ data: mockData })).rejects.toThrow(errorMessage);
      });
    });

    describe('useLogin hook', () => {
      it('Should handle successful registration', async () => {
        // Given
        mockHandleFetch.mockResolvedValue(mockReturnData);

        // When
        const { result } = renderHook(() => useLoginUser(), {
          wrapper: queryWrapper,
        });
        result.current.mutate({ data: mockData });

        // Then
        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true);
          expect(result.current.data).toBe(mockReturnData);
        });
      });

      it('Should handle error in a hook', async () => {
        // Given
        const errorMessage = 'Login failed';
        mockHandleFetch.mockRejectedValue(new Error(errorMessage));

        // When
        const { result } = renderHook(() => useLoginUser(), {
          wrapper: queryWrapper,
        });

        // Then
        await expect(
          result.current.mutateAsync({ data: mockData })
        ).rejects.toThrowError(errorMessage);
        await waitFor(() => {
          expect(result.current.isError).toBe(true);
        });
      });
    });
  });
});
