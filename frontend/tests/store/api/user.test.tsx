import {
  customBaseQuery,
  CustomFetchBaseQueryError,
} from '../../../src/store/api/base.ts';
import { renderHookWithProviders } from '../../test-utils.tsx';
import {
  useAddRoleMutation,
  useGetUsersQuery,
  usersApi,
} from '../../../src/store/api/user.ts';
import { renderHook, waitFor } from '@testing-library/react';
import { expect } from 'vitest';
import { act, PropsWithChildren } from 'react';
import { setupStore } from '../../../src/store';
import { Provider } from 'react-redux';
import { RoleType } from '../../../src/types/RoleTypes.ts';

vi.mock('../../../src/store/api/base.ts', () => ({
  customBaseQuery: vi.fn(),
}));

const USER_CONTENT = [
  {
    id: 589,
    email: 'operator@maxq.com',
    enabled: true,
    roles: [
      {
        id: 14,
        name: 'OPERATOR',
      },
    ],
  },
];

const MOCK_DEFAULT_USERS_DATA = {
  content: USER_CONTENT,
  pageable: {
    pageNumber: 0,
    pageSize: 15,
    sort: {
      empty: true,
      sorted: false,
      unsorted: true,
    },
    offset: 0,
    paged: true,
    unpaged: false,
  },
  last: true,
  totalElements: 1,
  totalPages: 1,
  size: 15,
  number: 0,
  sort: {
    empty: true,
    sorted: false,
    unsorted: true,
  },
  first: true,
  numberOfElements: 1,
  empty: false,
};

describe('Users API', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('useGetUsersQuery', () => {
    const defaultError = 'Unknown error while fetching user data';

    it('should make API call with default parameters', async () => {
      // Given
      vi.mocked(customBaseQuery).mockResolvedValue({
        data: MOCK_DEFAULT_USERS_DATA,
      });

      // When
      renderHookWithProviders(() => useGetUsersQuery());

      // Then
      await waitFor(() => {
        expect(customBaseQuery).toHaveBeenCalledOnce();
        expect(customBaseQuery).toHaveBeenCalledWith(
          {
            url: `/users?page=0&size=15`,
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

    it('should make API call with custom parameters', async () => {
      // Given
      const page = 1;
      const size = 10;
      vi.mocked(customBaseQuery).mockResolvedValue({
        data: MOCK_DEFAULT_USERS_DATA,
      });

      // When
      renderHookWithProviders(() => useGetUsersQuery({ page, size }));

      // Then
      await waitFor(() => {
        expect(customBaseQuery).toHaveBeenCalledOnce();
        expect(customBaseQuery).toHaveBeenCalledWith(
          {
            url: `/users?page=${page}&size=${size}`,
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

    it('should return users', async () => {
      // Given
      vi.mocked(customBaseQuery).mockResolvedValue({
        data: MOCK_DEFAULT_USERS_DATA,
      });

      // When
      const { result } = renderHookWithProviders(() => useGetUsersQuery());

      // Then
      await waitFor(() => {
        const currentResult = result.current as ReturnType<
          typeof useGetUsersQuery
        >;
        expect(currentResult.isSuccess).toBe(true);
        expect(currentResult.data).toStrictEqual(MOCK_DEFAULT_USERS_DATA);
      });
    });

    it('should handle loading state', () => {
      // Given
      let resolvePromise: (value: {
        data: typeof MOCK_DEFAULT_USERS_DATA;
      }) => void;
      const controlledPromise = new Promise<{
        data: typeof MOCK_DEFAULT_USERS_DATA;
      }>((resolve) => {
        resolvePromise = resolve;
      });

      vi.mocked(customBaseQuery).mockReturnValue(controlledPromise);

      // When
      const { result } = renderHookWithProviders(() => useGetUsersQuery());

      // Then
      const currentResult = result.current as ReturnType<
        typeof useGetUsersQuery
      >;
      expect(currentResult.isLoading).toBe(true);
      expect(currentResult.data).toBe(undefined);
      expect(currentResult.isSuccess).toBe(false);
      expect(currentResult.isError).toBe(false);

      // Clean up
      act(() => {
        resolvePromise({ data: MOCK_DEFAULT_USERS_DATA });
      });
    });

    it('should handle error state', async () => {
      // Given
      const errorMessage = 'Error while fetching users data';
      vi.mocked(customBaseQuery).mockResolvedValue({
        error: {
          status: 500,
          message: errorMessage,
        },
      });

      // When
      const { result } = renderHookWithProviders(() => useGetUsersQuery());

      // Then
      await waitFor(() => {
        const currentResult = result.current as ReturnType<
          typeof useGetUsersQuery
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
        data: MOCK_DEFAULT_USERS_DATA,
      });

      const store = setupStore();
      const wrapper = ({ children }: PropsWithChildren) => (
        <Provider store={store}>{children}</Provider>
      );

      // When
      const { result: result1 } = renderHook(() => useGetUsersQuery(), {
        wrapper,
      });
      const { result: result2 } = renderHook(() => useGetUsersQuery(), {
        wrapper,
      });

      // Then
      await waitFor(() => {
        const currentResult1 = result1.current as ReturnType<
          typeof useGetUsersQuery
        >;
        expect(currentResult1.isSuccess).toBe(true);

        const currentResult2 = result2.current as ReturnType<
          typeof useGetUsersQuery
        >;
        expect(currentResult2.isSuccess).toBe(true);
      });
      expect(customBaseQuery).toHaveBeenCalledOnce();
    });

    it('should allow manual refetches', async () => {
      // Given
      vi.mocked(customBaseQuery).mockResolvedValue({
        data: MOCK_DEFAULT_USERS_DATA,
      });

      // When
      const { result } = renderHookWithProviders(() => useGetUsersQuery());
      const { refetch } = result.current as ReturnType<typeof useGetUsersQuery>;
      await waitFor(() => {
        const currentResult = result.current as ReturnType<
          typeof useGetUsersQuery
        >;
        expect(currentResult.isSuccess).toBe(true);
      });
      await refetch();

      // Then
      await waitFor(() => {
        expect(customBaseQuery).toHaveBeenCalledTimes(2);
      });
    });

    it('should provide Users tag to invalidate cache', async () => {
      // Given
      vi.mocked(customBaseQuery).mockResolvedValue({
        data: MOCK_DEFAULT_USERS_DATA,
      });

      // When
      const { result, store } = renderHookWithProviders(() =>
        useGetUsersQuery()
      );
      await waitFor(() => {
        const currentResult = result.current as ReturnType<
          typeof useGetUsersQuery
        >;
        expect(currentResult.isSuccess).toBe(true);
      });

      // Then
      expect(() => {
        store.dispatch(usersApi.util.invalidateTags(['Users']));
      }).not.toThrow();
    });
  });

  describe('useAddRoleMutation', () => {
    const userId = 1;
    const role: RoleType = {
      id: 1,
      name: 'ROLE_1',
    };
    const defaultRoleUpdateErrorMessage =
      'Error during role modification, try again later';

    it('should make API call with correct parameters', async () => {
      // Given
      vi.mocked(customBaseQuery).mockResolvedValue({
        data: undefined,
      });

      const { result } = renderHookWithProviders(() => useAddRoleMutation());

      // When
      const currentResult = result.current as ReturnType<
        typeof useAddRoleMutation
      >;
      const [addRole] = currentResult;
      act(() => {
        void addRole({ userId, role });
      });

      // Then
      await waitFor(() => {
        expect(customBaseQuery).toHaveBeenCalledOnce();
        expect(customBaseQuery).toHaveBeenCalledWith(
          {
            url: `/users/${userId}/addRole?role=${role.id}`,
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            defaultError: defaultRoleUpdateErrorMessage,
          },
          expect.any(Object),
          undefined
        );
      });
    });

    it('should return success', async () => {
      // Given
      vi.mocked(customBaseQuery).mockResolvedValue({
        data: undefined,
      });

      const { result } = renderHookWithProviders(() => useAddRoleMutation());

      // When
      const currentResult = result.current as ReturnType<
        typeof useAddRoleMutation
      >;
      const [addRole] = currentResult;
      act(() => {
        void addRole({ userId, role });
      });

      // Then
      await waitFor(() => {
        const currentResult = result.current as ReturnType<
          typeof useAddRoleMutation
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

      const { result } = renderHookWithProviders(() => useAddRoleMutation());

      // When
      const currentResult = result.current as ReturnType<
        typeof useAddRoleMutation
      >;
      const [addRole] = currentResult;
      act(() => {
        void addRole({ userId, role });
      });

      // Then
      await waitFor(() => {
        const currentResult = result.current as ReturnType<
          typeof useAddRoleMutation
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
      const errorMessage = 'Error while fetching roles data';
      vi.mocked(customBaseQuery).mockResolvedValue({
        error: {
          status: 500,
          message: errorMessage,
        },
      });

      const { result } = renderHookWithProviders(() => useAddRoleMutation());

      // When
      const currentResult = result.current as ReturnType<
        typeof useAddRoleMutation
      >;
      const [addRole] = currentResult;
      act(() => {
        void addRole({ userId, role });
      });

      // Then
      await waitFor(() => {
        const currentResult = result.current as ReturnType<
          typeof useAddRoleMutation
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
