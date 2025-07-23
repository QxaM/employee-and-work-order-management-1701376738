import { afterEach, describe } from 'vitest';
import {
  passwordUpdate,
  requestPasswordReset,
  usePasswordUpdate,
  useResetRequest,
} from '../../src/api/passwordReset.ts';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientWrapper as queryWrapper } from '../test-utils.tsx';

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

  describe('Password update', () => {
    const mockToken = 'test';
    const mockPassword = 'password';

    describe('passwordUpdate', () => {
      it('Should request successfully', async () => {
        // Given
        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
        });

        // When
        await expect(
          passwordUpdate({ token: mockToken, password: mockPassword })
        ).resolves.not.toThrow();

        // Then
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining(
            `/password/reset?token=${mockToken}&password=${btoa(mockPassword)}`
          ),
          expect.objectContaining({
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
          })
        );
      });
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
        passwordUpdate({ token: mockToken, password: mockPassword })
      ).rejects.toThrow('Error during verification process, try again later');
    });

    it('Should handle token expired error', async () => {
      // Given
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 422,
      });

      // When

      // Then
      await expect(
        passwordUpdate({ token: mockToken, password: mockPassword })
      ).rejects.toThrow('Token expired, try new password reset request');
    });

    describe('usePasswordUpdate hook', () => {
      it('Should handle successful request', async () => {
        // Given
        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
        });

        // When
        const { result } = renderHook(() => usePasswordUpdate(), {
          wrapper: queryWrapper,
        });
        result.current.mutate({ token: mockToken, password: mockPassword });

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
        const { result } = renderHook(() => usePasswordUpdate(), {
          wrapper: queryWrapper,
        });

        // Then
        await expect(
          result.current.mutateAsync({
            token: mockToken,
            password: mockPassword,
          })
        ).rejects.toThrow('Error during verification process, try again later');
        await waitFor(() => {
          expect(result.current.isError).toBe(true);
        });
      });

      it('Should handle token expiration in a hook', async () => {
        // Given
        global.fetch = vi.fn().mockResolvedValue({
          ok: false,
          status: 422,
        });

        // When
        const { result } = renderHook(() => usePasswordUpdate(), {
          wrapper: queryWrapper,
        });

        // Then
        await expect(
          result.current.mutateAsync({
            token: mockToken,
            password: mockPassword,
          })
        ).rejects.toThrow('Token expired, try new password reset request');
        await waitFor(() => {
          expect(result.current.isError).toBe(true);
        });
      });
    });
  });
});
