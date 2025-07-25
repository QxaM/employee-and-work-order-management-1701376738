import {
  customBaseQuery,
  CustomFetchBaseQueryError,
} from '../../../src/store/api/base.ts';
import { renderHookWithProviders } from '../../test-utils.tsx';
import { act } from 'react';
import { waitFor } from '@testing-library/react';
import {
  RegisterType,
  useRegisterMutation,
} from '../../../src/store/api/auth.ts';

vi.mock('../../../src/store/api/base.ts', () => ({
  customBaseQuery: vi.fn(),
}));

describe('Authorization API', () => {
  describe('useRegisterMutation', () => {
    const registerData: RegisterType = {
      email: 'test@test.com',
      password: '12345',
    };
    const defaultRegisterErrorMessage =
      'Unknown error during registration process!';

    it('Should make API call with correct parameters', async () => {
      // Given
      vi.mocked(customBaseQuery).mockResolvedValue({ data: undefined });
      const { result } = renderHookWithProviders(() => useRegisterMutation());

      // When
      const currentResult = result.current as ReturnType<
        typeof useRegisterMutation
      >;
      const [register] = currentResult;
      act(() => {
        void register(registerData);
      });

      // Then
      await waitFor(() => {
        expect(customBaseQuery).toHaveBeenCalledOnce();
        expect(customBaseQuery).toHaveBeenCalledWith(
          {
            url: `/register`,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(registerData),
            defaultError: defaultRegisterErrorMessage,
          },
          expect.any(Object),
          undefined
        );
      });
    });

    it('should return success', async () => {
      // Given
      vi.mocked(customBaseQuery).mockResolvedValue({ data: undefined });
      const { result } = renderHookWithProviders(() => useRegisterMutation());

      // When
      const currentResult = result.current as ReturnType<
        typeof useRegisterMutation
      >;
      const [register] = currentResult;
      act(() => {
        void register(registerData);
      });

      // Then
      await waitFor(() => {
        const currentResult = result.current as ReturnType<
          typeof useRegisterMutation
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

      const { result } = renderHookWithProviders(() => useRegisterMutation());

      // When
      const currentResult = result.current as ReturnType<
        typeof useRegisterMutation
      >;
      const [register] = currentResult;
      act(() => {
        void register(registerData);
      });

      // Then
      await waitFor(() => {
        const currentResult = result.current as ReturnType<
          typeof useRegisterMutation
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

      const { result } = renderHookWithProviders(() => useRegisterMutation());

      // when
      const currentResult = result.current as ReturnType<
        typeof useRegisterMutation
      >;
      const [register] = currentResult;
      act(() => {
        void register(registerData);
      });

      // Then
      await waitFor(() => {
        const currentResult = result.current as ReturnType<
          typeof useRegisterMutation
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
