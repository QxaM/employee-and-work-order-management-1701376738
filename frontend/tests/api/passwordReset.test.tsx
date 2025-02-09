import { afterEach, describe } from 'vitest';
import {
  requestPasswordReset,
  useResetRequest,
} from '../../src/api/passwordReset.ts';
import { renderHook, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryWrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('Password reset tests', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Password reset request', () => {
    const mockEmail = 'test@test.com';

    describe('requestResetPassword', () => {
      it('Should request successfully', async () => {
        // Given
        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
        });

        // When
        await expect(
          requestPasswordReset({ email: mockEmail })
        ).resolves.not.toThrow();

        // Then
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining(`/password/reset?email=${mockEmail}`),
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          })
        );
      });

      it('Should handle API errors', async () => {
        // Given
        global.fetch = vi.fn().mockResolvedValue({
          ok: false,
          status: 404,
        });

        // When

        // Then
        await expect(
          requestPasswordReset({ email: mockEmail })
        ).rejects.toThrow('Error requesting password reset, try again later');
      });
    });

    describe('useRequestResetPassword hook', () => {
      it('Should handle successful request', async () => {
        // Given
        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
        });

        // When
        const { result } = renderHook(() => useResetRequest(), {
          wrapper: queryWrapper,
        });
        result.current.mutate({ email: mockEmail });

        // Then
        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true);
        });
      });

      it('Should handle error in a hook', async () => {
        // Given
        global.fetch = vi.fn().mockResolvedValue({
          ok: false,
          status: 404,
        });

        // When
        const { result } = renderHook(() => useResetRequest(), {
          wrapper: queryWrapper,
        });

        // Then
        await expect(
          result.current.mutateAsync({ email: mockEmail })
        ).rejects.toThrow('Error requesting password reset, try again later');
        await waitFor(() => {
          expect(result.current.isError).toBe(true);
        });
      });
    });
  });
});
