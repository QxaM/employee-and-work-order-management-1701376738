import { beforeEach } from 'vitest';
import { waitFor } from '@testing-library/react';

import {
  customBaseQuery,
  CustomFetchBaseQueryError,
} from '../../../src/store/api/base.ts';
import { renderHookWithProviders } from '../../test-utils.tsx';
import {
  usePasswordUpdateMutation,
  useRequestPasswordResetMutation,
} from '../../../src/store/api/passwordReset.ts';
import { act } from 'react';

vi.mock('../../../src/store/api/base.ts', () => ({
  customBaseQuery: vi.fn(),
}));

describe('Users API', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('useRequestPasswordResetMutation', () => {
    const email = 'test@test.com';

    it('Should make API call with correct parameters', async () => {
      // Given
      vi.mocked(customBaseQuery).mockResolvedValue({ data: undefined });
      const { result } = renderHookWithProviders(() =>
        useRequestPasswordResetMutation()
      );

      // When
      const currentResult = result.current as ReturnType<
        typeof useRequestPasswordResetMutation
      >;
      const [requestPasswordReset] = currentResult;
      act(() => {
        void requestPasswordReset(email);
      });

      // Then
      await waitFor(() => {
        expect(customBaseQuery).toHaveBeenCalledOnce();
        expect(customBaseQuery).toHaveBeenCalledWith(
          {
            url: `/password/reset?email=${email}`,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          },
          expect.any(Object),
          undefined
        );
      });
    });

    it('should return success', async () => {
      // Given
      vi.mocked(customBaseQuery).mockResolvedValue({ data: undefined });
      const { result } = renderHookWithProviders(() =>
        useRequestPasswordResetMutation()
      );

      // When
      const currentResult = result.current as ReturnType<
        typeof useRequestPasswordResetMutation
      >;
      const [requestPasswordReset] = currentResult;
      act(() => {
        void requestPasswordReset(email);
      });

      // Then
      await waitFor(() => {
        const currentResult = result.current as ReturnType<
          typeof useRequestPasswordResetMutation
        >;
        const [, { isSuccess, isLoading, isError, error }] = currentResult;
        expect(isSuccess).toBe(true);
        expect(isLoading).toBe(false);
        expect(isError).toBe(false);
        expect(error).toBe(undefined);
      });
    });

    it('should handle loading state', async () => {
      // Given
      let resolvePromise: (value: { data: undefined }) => void;
      const controlledPromise = new Promise<{ data: undefined }>((resolve) => {
        resolvePromise = resolve;
      });

      vi.mocked(customBaseQuery).mockReturnValue(controlledPromise);

      const { result } = renderHookWithProviders(() =>
        useRequestPasswordResetMutation()
      );

      // When
      const currentResult = result.current as ReturnType<
        typeof useRequestPasswordResetMutation
      >;
      const [requestPasswordReset] = currentResult;
      act(() => {
        void requestPasswordReset(email);
      });

      // Then
      await waitFor(() => {
        const currentResult = result.current as ReturnType<
          typeof useRequestPasswordResetMutation
        >;
        const [, { isSuccess, isLoading, isError, error }] = currentResult;
        expect(isSuccess).toBe(false);
        expect(isLoading).toBe(true);
        expect(isError).toBe(false);
        expect(error).toBe(undefined);
      });

      // Clean up - resolve the promise to avoid hanging
      act(() => {
        resolvePromise({ data: undefined });
      });
    });

    it('should handle error state', async () => {
      // Given
      const errorMessage = 'Error while requesting password reset';
      vi.mocked(customBaseQuery).mockResolvedValue({
        error: {
          status: 500,
          message: errorMessage,
        },
      });

      const { result } = renderHookWithProviders(() =>
        useRequestPasswordResetMutation()
      );

      // when
      const currentResult = result.current as ReturnType<
        typeof useRequestPasswordResetMutation
      >;
      const [requestPasswordReset] = currentResult;
      act(() => {
        void requestPasswordReset(email);
      });

      // Then
      await waitFor(() => {
        const currentResult = result.current as ReturnType<
          typeof useRequestPasswordResetMutation
        >;
        const [, { isSuccess, isLoading, isError, error }] = currentResult;
        expect(isSuccess).toBe(false);
        expect(isLoading).toBe(false);
        expect(isError).toBe(true);
        expect(error).toBeDefined();
        expect((error as CustomFetchBaseQueryError).status).toStrictEqual(500);
        expect((error as CustomFetchBaseQueryError).message).toStrictEqual(
          errorMessage
        );
      });
    });
  });

  describe('usePasswordUpdateMutation', () => {
    const password = '12345';
    const token = 'test-token';

    it('Should make API call with correct parameters', async () => {
      // Given
      vi.mocked(customBaseQuery).mockResolvedValue({ data: undefined });
      const { result } = renderHookWithProviders(() =>
        usePasswordUpdateMutation()
      );

      // When
      const currentResult = result.current as ReturnType<
        typeof usePasswordUpdateMutation
      >;
      const [updatePassword] = currentResult;
      act(() => {
        void updatePassword({ token, password });
      });

      // Then
      await waitFor(() => {
        expect(customBaseQuery).toHaveBeenCalledOnce();
        expect(customBaseQuery).toHaveBeenCalledWith(
          {
            url: `/password/reset?token=${token}&password=${btoa(password)}`,
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
          },
          expect.any(Object),
          undefined
        );
      });
    });

    it('should return success', async () => {
      // Given
      vi.mocked(customBaseQuery).mockResolvedValue({ data: undefined });
      const { result } = renderHookWithProviders(() =>
        usePasswordUpdateMutation()
      );

      // When
      const currentResult = result.current as ReturnType<
        typeof usePasswordUpdateMutation
      >;
      const [updatePassword] = currentResult;
      act(() => {
        void updatePassword({ token, password });
      });

      // Then
      await waitFor(() => {
        const currentResult = result.current as ReturnType<
          typeof usePasswordUpdateMutation
        >;
        const [, { isSuccess, isLoading, isError, error }] = currentResult;
        expect(isSuccess).toBe(true);
        expect(isLoading).toBe(false);
        expect(isError).toBe(false);
        expect(error).toBe(undefined);
      });
    });

    it('should handle loading state', async () => {
      // Given
      let resolvePromise: (value: { data: undefined }) => void;
      const controlledPromise = new Promise<{ data: undefined }>((resolve) => {
        resolvePromise = resolve;
      });

      vi.mocked(customBaseQuery).mockReturnValue(controlledPromise);

      const { result } = renderHookWithProviders(() =>
        usePasswordUpdateMutation()
      );

      // When
      const currentResult = result.current as ReturnType<
        typeof usePasswordUpdateMutation
      >;
      const [updatePassword] = currentResult;
      act(() => {
        void updatePassword({ token, password });
      });

      // Then
      await waitFor(() => {
        const currentResult = result.current as ReturnType<
          typeof usePasswordUpdateMutation
        >;
        const [, { isSuccess, isLoading, isError, error }] = currentResult;
        expect(isSuccess).toBe(false);
        expect(isLoading).toBe(true);
        expect(isError).toBe(false);
        expect(error).toBe(undefined);
      });

      // Clean up - resolve the promise to avoid hanging
      act(() => {
        resolvePromise({ data: undefined });
      });
    });

    it('should handle error state', async () => {
      // Given
      const errorMessage = 'Error while requesting password reset';
      vi.mocked(customBaseQuery).mockResolvedValue({
        error: {
          status: 500,
          message: errorMessage,
        },
      });

      const { result } = renderHookWithProviders(() =>
        usePasswordUpdateMutation()
      );

      // when
      const currentResult = result.current as ReturnType<
        typeof usePasswordUpdateMutation
      >;
      const [updatePassword] = currentResult;
      act(() => {
        void updatePassword({ token, password });
      });

      // Then
      await waitFor(() => {
        const currentResult = result.current as ReturnType<
          typeof usePasswordUpdateMutation
        >;
        const [, { isSuccess, isLoading, isError, error }] = currentResult;
        expect(isSuccess).toBe(false);
        expect(isLoading).toBe(false);
        expect(isError).toBe(true);
        expect(error).toBeDefined();
        expect((error as CustomFetchBaseQueryError).status).toStrictEqual(500);
        expect((error as CustomFetchBaseQueryError).message).toStrictEqual(
          errorMessage
        );
      });
    });
  });
});
