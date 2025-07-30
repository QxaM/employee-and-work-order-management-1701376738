import { RoleType } from '../../../src/types/RoleTypes.ts';
import { renderHookWithProviders } from '../../test-utils.tsx';
import { rolesApi, useGetRolesQuery } from '../../../src/store/api/role.ts';
import { renderHook, waitFor } from '@testing-library/react';
import {
  customBaseQuery,
  CustomFetchBaseQueryError,
} from '../../../src/store/api/base.ts';
import { act, PropsWithChildren } from 'react';
import { setupStore } from '../../../src/store';
import { Provider } from 'react-redux';

vi.mock('../../../src/store/api/base.ts', () => ({
  customBaseQuery: vi.fn(),
}));

const mockData: RoleType[] = [
  {
    id: 1,
    name: 'ROLE_1',
  },
  {
    id: 2,
    name: 'ROLE_2',
  },
];

describe('Role API', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('useGetRolesQuery hook', () => {
    const defaultError =
      'Error while fetching roles data, please try again later.';

    it('should make API call with correct parameters', async () => {
      // Given
      vi.mocked(customBaseQuery).mockResolvedValue({
        data: mockData,
      });

      // When
      renderHookWithProviders(() => useGetRolesQuery());

      // Then
      await waitFor(() => {
        expect(customBaseQuery).toHaveBeenCalledOnce();
        expect(customBaseQuery).toHaveBeenCalledWith(
          {
            url: '/roles',
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            defaultError,
          },
          expect.any(Object),
          undefined
        );
      });
    });

    it('should return data', async () => {
      // Given
      vi.mocked(customBaseQuery).mockResolvedValue({
        data: mockData,
      });

      // When
      const { result } = renderHookWithProviders(() => useGetRolesQuery());

      // Then
      await waitFor(() => {
        const currentResult = result.current as ReturnType<
          typeof useGetRolesQuery
        >;
        expect(currentResult.isSuccess).toBe(true);
        expect(currentResult.data).toStrictEqual(mockData);
      });
    });

    it('should handle loading state', () => {
      // Given
      let resolvePromise: (value: { data: RoleType[] }) => void;
      const controlledPromise = new Promise<{ data: RoleType[] }>((resolve) => {
        resolvePromise = resolve;
      });

      vi.mocked(customBaseQuery).mockReturnValue(controlledPromise);

      // when
      const { result } = renderHookWithProviders(() => useGetRolesQuery());

      // Then
      const currentResult = result.current as ReturnType<
        typeof useGetRolesQuery
      >;
      expect(currentResult.isLoading).toBe(true);
      expect(currentResult.data).toBeUndefined();
      expect(currentResult.isSuccess).toBe(false);
      expect(currentResult.isError).toBe(false);

      // Clean up - resolve the promise to avoid hanging
      act(() => {
        resolvePromise({ data: mockData });
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
      const { result } = renderHookWithProviders(() => useGetRolesQuery());

      // Then
      await waitFor(() => {
        const currentResult = result.current as ReturnType<
          typeof useGetRolesQuery
        >;
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
        data: mockData,
      });

      const store = setupStore();
      const wrapper = ({ children }: PropsWithChildren) => (
        <Provider store={store}>{children}</Provider>
      );

      // when
      const { result: result1 } = renderHook(() => useGetRolesQuery(), {
        wrapper,
      });
      const { result: result2 } = renderHook(() => useGetRolesQuery(), {
        wrapper,
      });

      // Then
      await waitFor(() => {
        const currentResult1 = result1.current as ReturnType<
          typeof useGetRolesQuery
        >;
        expect(currentResult1.isSuccess).toBe(true);
        const currentResult2 = result2.current as ReturnType<
          typeof useGetRolesQuery
        >;
        expect(currentResult2.isSuccess).toBe(true);
      });
      expect(customBaseQuery).toHaveBeenCalledOnce();
    });

    it('Should allow manual refetches', async () => {
      // Given
      vi.mocked(customBaseQuery).mockResolvedValue({
        data: mockData,
      });

      // When
      const { result } = renderHookWithProviders(() => useGetRolesQuery());
      const { refetch } = result.current as ReturnType<typeof useGetRolesQuery>;
      await waitFor(() => {
        const currentResult = result.current as ReturnType<
          typeof useGetRolesQuery
        >;
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
        data: mockData,
      });

      // When
      const { result, store } = renderHookWithProviders(() =>
        useGetRolesQuery()
      );
      await waitFor(() => {
        const currentResult = result.current as ReturnType<
          typeof useGetRolesQuery
        >;
        expect(currentResult.isSuccess).toBe(true);
      });

      // Then
      expect(() => {
        store.dispatch(rolesApi.util.invalidateTags(['Roles']));
      }).not.toThrow();
    });
  });
});
