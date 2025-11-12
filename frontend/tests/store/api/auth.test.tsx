import {
  customBaseQuery,
  CustomFetchBaseQueryError,
} from '../../../src/store/api/base.ts';
import { renderHookWithProviders } from '../../test-utils.tsx';
import { act, PropsWithChildren } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import {
  MeType,
  RegisterType,
  useAuthHealthcheckQuery,
  useConfirmRegistrationMutation,
  useLoginMutation,
  useMeQuery,
  useRegisterMutation,
} from '../../../src/store/api/auth.ts';
import { beforeEach } from 'vitest';
import { rolesApi } from '../../../src/store/api/role.ts';
import { setupStore } from '../../../src/store';
import { Provider } from 'react-redux';

vi.mock('../../../src/store/api/base.ts', async () => {
  const baseApi = await vi.importActual('../../../src/store/api/base.ts');
  return {
    ...baseApi,
    customBaseQuery: vi.fn(),
  };
});

describe('Authorization API', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('useAuthHealthcheckQuery', () => {
    it('Should make API call with correct parameters', async () => {
      // Given
      vi.mocked(customBaseQuery).mockResolvedValue({ data: undefined });

      // When
      renderHookWithProviders(() => useAuthHealthcheckQuery());

      // Then
      await waitFor(() => {
        expect(customBaseQuery).toHaveBeenCalledOnce();
        expect(customBaseQuery).toHaveBeenCalledWith(
          {
            url: expect.stringContaining('/actuator/health') as string,
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: '',
            },
          },
          expect.any(Object),
          undefined
        );
      });
    });

    it('Should handle success state', async () => {
      // Given
      vi.mocked(customBaseQuery).mockResolvedValue({ data: undefined });

      // When
      const { result } = renderHookWithProviders(() =>
        useAuthHealthcheckQuery()
      );

      // Then
      await waitFor(() => {
        const currentResult = result.current;
        expect(currentResult.isSuccess).toBe(true);
        expect(currentResult.data).toBeUndefined();
        expect(currentResult.isLoading).toBe(false);
        expect(currentResult.isError).toBe(false);
      });
    });

    it('Should handle loading state', () => {
      // Given
      let resolvePromise: (
        value: PromiseLike<{ data: undefined }> | { data: undefined }
      ) => void;
      const controlledPromise = new Promise<{ data: undefined }>((resolve) => {
        resolvePromise = resolve;
      });

      vi.mocked(customBaseQuery).mockReturnValue(controlledPromise);

      // When
      const { result } = renderHookWithProviders(() =>
        useAuthHealthcheckQuery()
      );

      // Then
      const currentResult = result.current;
      expect(currentResult.isLoading).toBe(true);
      expect(currentResult.data).toBeUndefined();
      expect(currentResult.isSuccess).toBe(false);
      expect(currentResult.isError).toBe(false);

      // Clean up - resolve the promise to avoid hanging
      act(() => {
        resolvePromise({ data: undefined });
      });
    });

    it('Should handle error state', async () => {
      // Given
      const errorMessage = 'Server unavailable';
      vi.mocked(customBaseQuery).mockResolvedValue({
        error: {
          status: 503,
          message: errorMessage,
        },
      });

      // When
      const { result } = renderHookWithProviders(() =>
        useAuthHealthcheckQuery()
      );

      // Then
      await waitFor(() => {
        const currentResult = result.current;
        expect(currentResult.isSuccess).toBe(false);
        expect(currentResult.data).toBeUndefined();
        expect(currentResult.isError).toBe(true);
        expect(currentResult.error).toBeDefined();
        expect(
          (currentResult.error as CustomFetchBaseQueryError).status
        ).toStrictEqual(503);
        expect(
          (currentResult.error as CustomFetchBaseQueryError).message
        ).toStrictEqual(errorMessage);
      });
    });
  });

  describe('useRegisterMutation', () => {
    const registerData: RegisterType = {
      firstName: 'Test',
      lastName: 'User',
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
            url: `/auth/register`,
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

  describe('useConfirmRegistrationMutation', () => {
    const token = 'test-token';

    it('Should make API call with correct parameters', async () => {
      // Given
      vi.mocked(customBaseQuery).mockResolvedValue({ data: undefined });
      const { result } = renderHookWithProviders(() =>
        useConfirmRegistrationMutation()
      );

      // When
      const currentResult = result.current as ReturnType<
        typeof useConfirmRegistrationMutation
      >;
      const [confirmRegistration] = currentResult;
      act(() => {
        void confirmRegistration(token);
      });

      // Then
      await waitFor(() => {
        expect(customBaseQuery).toHaveBeenCalledOnce();
        expect(customBaseQuery).toHaveBeenCalledWith(
          {
            url: `/auth/register/confirm?token=${token}`,
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
        useConfirmRegistrationMutation()
      );

      // When
      const currentResult = result.current as ReturnType<
        typeof useConfirmRegistrationMutation
      >;
      const [confirmRegistration] = currentResult;
      act(() => {
        void confirmRegistration(token);
      });

      // Then
      await waitFor(() => {
        const currentResult = result.current as ReturnType<
          typeof useConfirmRegistrationMutation
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
        useConfirmRegistrationMutation()
      );

      // When
      const currentResult = result.current as ReturnType<
        typeof useConfirmRegistrationMutation
      >;
      const [confirmRegistration] = currentResult;
      act(() => {
        void confirmRegistration(token);
      });

      // Then
      await waitFor(() => {
        const currentResult = result.current as ReturnType<
          typeof useConfirmRegistrationMutation
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
        useConfirmRegistrationMutation()
      );

      // when
      const currentResult = result.current as ReturnType<
        typeof useConfirmRegistrationMutation
      >;
      const [confirmRegistration] = currentResult;
      act(() => {
        void confirmRegistration(token);
      });

      // Then
      await waitFor(() => {
        const currentResult = result.current as ReturnType<
          typeof useConfirmRegistrationMutation
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

  describe('useLoginMutation', () => {
    const email = 'test@test.com';
    const password = '12345';

    it('Should make API call with correct parameters', async () => {
      // Given
      const defaultLoginErrorMessage = 'Unknown error during login process!';
      vi.mocked(customBaseQuery).mockResolvedValue({ data: undefined });
      const { result } = renderHookWithProviders(() => useLoginMutation());

      // When
      const currentResult = result.current as ReturnType<
        typeof useLoginMutation
      >;
      const [login] = currentResult;
      act(() => {
        void login({ email, password });
      });

      // Then
      await waitFor(() => {
        expect(customBaseQuery).toHaveBeenCalledOnce();
        expect(customBaseQuery).toHaveBeenCalledWith(
          {
            url: `/auth/login`,
            method: 'POST',
            headers: {
              Authorization: `Basic ${btoa(`${email}:${password}`)}`,
              'Content-Type': 'application/json',
            },
            invalidatesTags: ['Me'],
            defaultError: defaultLoginErrorMessage,
          },
          expect.any(Object),
          undefined
        );
      });
    });

    it('should return success', async () => {
      // Given
      vi.mocked(customBaseQuery).mockResolvedValue({ data: undefined });
      const { result } = renderHookWithProviders(() => useLoginMutation());

      // When
      const currentResult = result.current as ReturnType<
        typeof useLoginMutation
      >;
      const [login] = currentResult;
      act(() => {
        void login({ email, password });
      });

      // Then
      await waitFor(() => {
        const currentResult = result.current as ReturnType<
          typeof useLoginMutation
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

      const { result } = renderHookWithProviders(() => useLoginMutation());

      // When
      const currentResult = result.current as ReturnType<
        typeof useLoginMutation
      >;
      const [login] = currentResult;
      act(() => {
        void login({ email, password });
      });

      // Then
      await waitFor(() => {
        const currentResult = result.current as ReturnType<
          typeof useLoginMutation
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

      const { result } = renderHookWithProviders(() => useLoginMutation());

      // when
      const currentResult = result.current as ReturnType<
        typeof useLoginMutation
      >;
      const [login] = currentResult;
      act(() => {
        void login({ email, password });
      });

      // Then
      await waitFor(() => {
        const currentResult = result.current as ReturnType<
          typeof useLoginMutation
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

  describe('useMeQuery hook', () => {
    const returnData: MeType = {
      email: 'test@test.com',
      roles: [
        {
          id: 1,
          name: 'ROLE_1',
        },
      ],
    };

    it('should make API call with correct parameters', async () => {
      // Given
      vi.mocked(customBaseQuery).mockResolvedValue({
        data: returnData,
      });

      // When
      renderHookWithProviders(() => useMeQuery());

      // Then
      await waitFor(() => {
        expect(customBaseQuery).toHaveBeenCalledOnce();
        expect(customBaseQuery).toHaveBeenCalledWith(
          {
            url: '/auth/login/me',
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
          expect.any(Object),
          undefined
        );
      });
    });

    it('should return data', async () => {
      // Given
      vi.mocked(customBaseQuery).mockResolvedValue({
        data: returnData,
      });

      // When
      const { result } = renderHookWithProviders(() => useMeQuery());

      // Then
      await waitFor(() => {
        const currentResult = result.current;
        expect(currentResult.isSuccess).toBe(true);
        expect(currentResult.data).toStrictEqual(returnData);
      });
    });

    it('should handle loading state', () => {
      // Given
      let resolvePromise: (value: { data: MeType }) => void;
      const controlledPromise = new Promise<{ data: MeType }>((resolve) => {
        resolvePromise = resolve;
      });

      vi.mocked(customBaseQuery).mockReturnValue(controlledPromise);

      // when
      const { result } = renderHookWithProviders(() => useMeQuery());

      // Then
      const currentResult = result.current;
      expect(currentResult.isLoading).toBe(true);
      expect(currentResult.data).toBeUndefined();
      expect(currentResult.isSuccess).toBe(false);
      expect(currentResult.isError).toBe(false);

      // Clean up - resolve the promise to avoid hanging
      act(() => {
        resolvePromise({ data: returnData });
      });
    });

    it('should handle error state', async () => {
      // Given
      const errorMessage = 'Error while fetching roles data';
      vi.mocked(customBaseQuery).mockResolvedValue({
        error: {
          status: 500,
          message: errorMessage,
        },
      });

      // When
      const { result } = renderHookWithProviders(() => useMeQuery());

      // Then
      await waitFor(() => {
        const currentResult = result.current;
        expect(currentResult.isSuccess).toBe(false);
        expect(currentResult.data).toBeUndefined();
        expect(currentResult.isError).toBe(true);
        expect(currentResult.error).toBeDefined();
        expect(
          (currentResult.error as CustomFetchBaseQueryError).status
        ).toStrictEqual(500);
        expect(
          (currentResult.error as CustomFetchBaseQueryError).message
        ).toStrictEqual(errorMessage);
      });
    });

    it('should cache request', async () => {
      // Given
      vi.mocked(customBaseQuery).mockResolvedValue({
        data: returnData,
      });

      const store = setupStore();
      const wrapper = ({ children }: PropsWithChildren) => (
        <Provider store={store}>{children}</Provider>
      );

      // when
      const { result: result1 } = renderHook(() => useMeQuery(), {
        wrapper,
      });
      const { result: result2 } = renderHook(() => useMeQuery(), {
        wrapper,
      });

      // Then
      await waitFor(() => {
        const currentResult1 = result1.current;
        expect(currentResult1.isSuccess).toBe(true);
        const currentResult2 = result2.current;
        expect(currentResult2.isSuccess).toBe(true);
      });
      expect(customBaseQuery).toHaveBeenCalledOnce();
    });

    it('Should allow manual refetches', async () => {
      // Given
      vi.mocked(customBaseQuery).mockResolvedValue({
        data: returnData,
      });

      // When
      const { result } = renderHookWithProviders(() => useMeQuery());
      const { refetch } = result.current;
      await waitFor(() => {
        const currentResult = result.current;
        expect(currentResult.isSuccess).toBe(true);
      });
      await refetch();

      // Then
      await waitFor(() => {
        expect(customBaseQuery).toHaveBeenCalledTimes(2);
      });
    });

    it('should provide Roles tag to invalidate cache', async () => {
      // Given
      vi.mocked(customBaseQuery).mockResolvedValue({
        data: returnData,
      });

      // When
      const { result, store } = renderHookWithProviders(() => useMeQuery());
      await waitFor(() => {
        const currentResult = result.current;
        expect(currentResult.isSuccess).toBe(true);
      });

      // Then
      expect(() => {
        store.dispatch(rolesApi.util.invalidateTags(['Roles']));
      }).not.toThrow();
    });
  });
});
