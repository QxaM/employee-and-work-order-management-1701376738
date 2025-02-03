import { afterEach, describe } from 'vitest';

import { register, useRegisterUser } from '@/api/auth.ts';
import { RegisterType } from '@/types/AuthorizationTypes.ts';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const queryWrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('Authorization tests', () => {
  describe('Registration', () => {
    afterEach(() => {
      vi.resetAllMocks();
    });

    const mockData: RegisterType = {
      email: 'test@test.com',
      password: 'password123',
    };

    describe('registerUser', () => {
      it('Should register successfully', async () => {
        // Given
        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          status: 201,
        });

        // When
        await expect(register({ data: mockData })).resolves.not.toThrow();

        // Then
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/register'),
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(mockData),
          })
        );
      });

      it('Should handle API error with message', async () => {
        // Given
        const errorMessage = 'Email already exists';
        global.fetch = vi.fn().mockResolvedValue({
          ok: false,
          status: 400,
          json: () => Promise.resolve({ message: errorMessage }),
        });

        // When

        // Then
        await expect(register({ data: mockData })).rejects.toThrow(
          errorMessage
        );
      });

      it('Should handle fetch rejects', async () => {
        // Given
        global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

        // When

        // Then
        await expect(register({ data: mockData })).rejects.toThrow(
          'Network error'
        );
      });

      it('Should handle non-API error', async () => {
        // Given
        global.fetch = vi.fn().mockResolvedValue({
          ok: false,
          status: 400,
          json: () => Promise.resolve('API is down!'),
        });

        // When

        // Then
        await expect(register({ data: mockData })).rejects.toThrow(
          'Unknown error during registration process!'
        );
      });
    });

    describe('useRegister hook', () => {
      it('Should handle successful registration', async () => {
        // Given
        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          status: 201,
        });

        // When
        const { result } = renderHook(() => useRegisterUser(), {
          wrapper: queryWrapper,
        });
        result.current.mutate({ data: mockData });

        // Then
        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true);
        });
      });

      it('Should handle error in a hook', async () => {
        // Given
        const errorMessage = 'Registration failed';
        global.fetch = vi.fn().mockResolvedValue({
          ok: false,
          status: 400,
          json: () => Promise.resolve({ message: errorMessage }),
        });

        // When
        const { result } = renderHook(() => useRegisterUser(), {
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
