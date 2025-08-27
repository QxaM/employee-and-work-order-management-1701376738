import { beforeEach } from 'vitest';
import {
  customBaseQuery,
  CustomFetchBaseQueryError,
} from '../../../src/store/api/base.ts';
import { renderHookWithProviders } from '../../test-utils.tsx';
import { renderHook, waitFor } from '@testing-library/react';
import { act, PropsWithChildren } from 'react';
import {
  useMyProfileQuery,
  useProfileHealthcheckQuery,
} from '../../../src/store/api/profile.ts';
import { setupStore } from '../../../src/store';
import { Provider } from 'react-redux';
import { rolesApi } from '../../../src/store/api/role.ts';
import { ProfileType } from '../../../src/types/api/ProfileTypes.ts';

vi.mock('../../../src/store/api/base.ts', async () => {
  const baseApi = await vi.importActual('../../../src/store/api/base.ts');
  return {
    ...baseApi,
    customBaseQuery: vi.fn(),
  };
});

describe('Profiles API', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('useAuthHealthcheckQuery', () => {
    it('Should make API call with correct parameters', async () => {
      // Given
      vi.mocked(customBaseQuery).mockResolvedValue({ data: undefined });

      // When
      renderHookWithProviders(() => useProfileHealthcheckQuery());

      // Then
      await waitFor(() => {
        expect(customBaseQuery).toHaveBeenCalledOnce();
        expect(customBaseQuery).toHaveBeenCalledWith(
          {
            url: '/profile/actuator/health',
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

    it('Should handle success state', async () => {
      // Given
      vi.mocked(customBaseQuery).mockResolvedValue({ data: undefined });

      // When
      const { result } = renderHookWithProviders(() =>
        useProfileHealthcheckQuery()
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
        useProfileHealthcheckQuery()
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
        useProfileHealthcheckQuery()
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

  describe('useMyProfile', () => {
    const returnData: ProfileType = {
      email: 'test@test.com',
      firstName: 'John',
      middleName: 'Jack',
      lastName: 'Doe',
    };

    it('should make API call with correct parameters', async () => {
      // Given
      vi.mocked(customBaseQuery).mockResolvedValue({
        data: returnData,
      });

      // When
      renderHookWithProviders(() => useMyProfileQuery());

      // Then
      await waitFor(() => {
        expect(customBaseQuery).toHaveBeenCalledOnce();
        expect(customBaseQuery).toHaveBeenCalledWith(
          {
            url: '/profile/profiles/me',
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
      const { result } = renderHookWithProviders(() => useMyProfileQuery());

      // Then
      await waitFor(() => {
        const currentResult = result.current;
        expect(currentResult.isSuccess).toBe(true);
        expect(currentResult.data).toStrictEqual(returnData);
      });
    });

    it('should handle loading state', () => {
      // Given
      let resolvePromise: (value: { data: ProfileType }) => void;
      const controlledPromise = new Promise<{ data: ProfileType }>(
        (resolve) => {
          resolvePromise = resolve;
        }
      );

      vi.mocked(customBaseQuery).mockReturnValue(controlledPromise);

      // when
      const { result } = renderHookWithProviders(() => useMyProfileQuery());

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
      const { result } = renderHookWithProviders(() => useMyProfileQuery());

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
      const { result: result1 } = renderHook(() => useMyProfileQuery(), {
        wrapper,
      });
      const { result: result2 } = renderHook(() => useMyProfileQuery(), {
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
      const { result } = renderHookWithProviders(() => useMyProfileQuery());
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

    it('should provide My Profile tag to invalidate cache', async () => {
      // Given
      vi.mocked(customBaseQuery).mockResolvedValue({
        data: returnData,
      });

      // When
      const { result, store } = renderHookWithProviders(() =>
        useMyProfileQuery()
      );
      await waitFor(() => {
        const currentResult = result.current;
        expect(currentResult.isSuccess).toBe(true);
      });

      // Then
      expect(() => {
        store.dispatch(rolesApi.util.invalidateTags(['MyProfile']));
      }).not.toThrow();
    });
  });
});
