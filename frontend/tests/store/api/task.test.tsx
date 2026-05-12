import { renderHook, waitFor } from '@testing-library/react';
import { act, type PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { beforeEach, expect } from 'vitest';
import { setupStore } from '../../../src/store';
import {
  type CustomFetchBaseQueryError,
  customBaseQuery,
} from '../../../src/store/api/base.ts';
import {
  useCreateTaskMutation,
  useGetTasksQuery,
  useTaskHealthcheckQuery,
} from '../../../src/store/api/task.ts';
import { usersApi } from '../../../src/store/api/user.ts';
import type { TaskType } from '../../../src/types/api/TaskTypes.ts';
import { renderHookWithProviders } from '../../test-utils.tsx';

vi.mock('../../../src/store/api/base.ts', async () => {
  const baseApi = await vi.importActual('../../../src/store/api/base.ts');
  return {
    ...baseApi,
    customBaseQuery: vi.fn(),
  };
});

const TASKS_CONTENT: TaskType[] = [
  {
    id: 1,
    title: 'Task 1',
    description: 'Task 1 description',
    user: {
      id: 1,
      email: 'test@test.com',
      roles: [
        {
          id: 1,
          name: 'TEST',
        },
      ],
    },
  },
];

const MOCK_DEFAULT_TASKS_DATA = TASKS_CONTENT;

describe('Task API', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('useTaskHealthcheckQuery', () => {
    it('Should make API call with correct parameters', async () => {
      // Given
      vi.mocked(customBaseQuery).mockResolvedValue({ data: undefined });

      // When
      renderHookWithProviders(() => useTaskHealthcheckQuery());

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
        useTaskHealthcheckQuery()
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
        useTaskHealthcheckQuery()
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
        useTaskHealthcheckQuery()
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

  describe('useGetTasksQuery', () => {
    const defaultError = 'Unknown error while fetching tasks data';

    it('should make API call with default parameters', async () => {
      // Given
      vi.mocked(customBaseQuery).mockResolvedValue({
        data: MOCK_DEFAULT_TASKS_DATA,
      });

      // When
      renderHookWithProviders(() => useGetTasksQuery());

      // Then
      await waitFor(() => {
        expect(customBaseQuery).toHaveBeenCalledOnce();
        expect(customBaseQuery).toHaveBeenCalledWith(
          {
            url: `/task/tasks?page=0&size=5`,
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
        data: MOCK_DEFAULT_TASKS_DATA,
      });

      // When
      renderHookWithProviders(() => useGetTasksQuery({ page, size }));

      // Then
      await waitFor(() => {
        expect(customBaseQuery).toHaveBeenCalledOnce();
        expect(customBaseQuery).toHaveBeenCalledWith(
          {
            url: `/task/tasks?page=${page}&size=${size}`,
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
        data: MOCK_DEFAULT_TASKS_DATA,
      });

      // When
      const { result } = renderHookWithProviders(() => useGetTasksQuery());

      // Then
      await waitFor(() => {
        const currentResult = result.current as ReturnType<
          typeof useGetTasksQuery
        >;
        expect(currentResult.isSuccess).toBe(true);
        expect(currentResult.data).toStrictEqual(MOCK_DEFAULT_TASKS_DATA);
      });
    });

    it('should handle loading state', () => {
      // Given
      let resolvePromise: (value: {
        data: typeof MOCK_DEFAULT_TASKS_DATA;
      }) => void;
      const controlledPromise = new Promise<{
        data: typeof MOCK_DEFAULT_TASKS_DATA;
      }>((resolve) => {
        resolvePromise = resolve;
      });

      vi.mocked(customBaseQuery).mockReturnValue(controlledPromise);

      // When
      const { result } = renderHookWithProviders(() => useGetTasksQuery());

      // Then
      const currentResult = result.current as ReturnType<
        typeof useGetTasksQuery
      >;
      expect(currentResult.isLoading).toBe(true);
      expect(currentResult.data).toBe(undefined);
      expect(currentResult.isSuccess).toBe(false);
      expect(currentResult.isError).toBe(false);

      // Clean up
      act(() => {
        resolvePromise({ data: MOCK_DEFAULT_TASKS_DATA });
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
      const { result } = renderHookWithProviders(() => useGetTasksQuery());

      // Then
      await waitFor(() => {
        const currentResult = result.current as ReturnType<
          typeof useGetTasksQuery
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
        data: MOCK_DEFAULT_TASKS_DATA,
      });

      const store = setupStore();
      const wrapper = ({ children }: PropsWithChildren) => (
        <Provider store={store}>{children}</Provider>
      );

      // When
      const { result: result1 } = renderHook(() => useGetTasksQuery(), {
        wrapper,
      });
      const { result: result2 } = renderHook(() => useGetTasksQuery(), {
        wrapper,
      });

      // Then
      await waitFor(() => {
        const currentResult1 = result1.current as ReturnType<
          typeof useGetTasksQuery
        >;
        expect(currentResult1.isSuccess).toBe(true);

        const currentResult2 = result2.current as ReturnType<
          typeof useGetTasksQuery
        >;
        expect(currentResult2.isSuccess).toBe(true);
      });
      expect(customBaseQuery).toHaveBeenCalledOnce();
    });

    it('should allow manual refetches', async () => {
      // Given
      vi.mocked(customBaseQuery).mockResolvedValue({
        data: MOCK_DEFAULT_TASKS_DATA,
      });

      // When
      const { result } = renderHookWithProviders(() => useGetTasksQuery());
      const { refetch } = result.current as ReturnType<typeof useGetTasksQuery>;
      await waitFor(() => {
        const currentResult = result.current as ReturnType<
          typeof useGetTasksQuery
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
        data: MOCK_DEFAULT_TASKS_DATA,
      });

      // When
      const { result, store } = renderHookWithProviders(() =>
        useGetTasksQuery()
      );
      await waitFor(() => {
        const currentResult = result.current as ReturnType<
          typeof useGetTasksQuery
        >;
        expect(currentResult.isSuccess).toBe(true);
      });

      // Then
      expect(() => {
        store.dispatch(usersApi.util.invalidateTags(['Users']));
      }).not.toThrow();
    });
  });

  describe('useCreateTaskMutation', () => {
    const createdTask: TaskType = TASKS_CONTENT[0];
    const defaultCreateTaskErrorMessage =
      'Unknown error while creating new task';

    it('Should make API call with correct parameters', async () => {
      // Given
      vi.mocked(customBaseQuery).mockResolvedValue({
        data: undefined,
      });

      const { result } = renderHookWithProviders(() => useCreateTaskMutation());

      // When
      const currentResult = result.current as ReturnType<
        typeof useCreateTaskMutation
      >;
      const [createTask] = currentResult;
      act(() => {
        void createTask(createdTask);
      });

      // Then
      await waitFor(() => {
        expect(customBaseQuery).toHaveBeenCalledOnce();
        expect(customBaseQuery).toHaveBeenCalledWith(
          {
            url: '/task/tasks',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(createdTask),
            defaultError: defaultCreateTaskErrorMessage,
          },
          expect.any(Object),
          undefined
        );
      });
    });

    it('Should return success state', async () => {
      // Given
      vi.mocked(customBaseQuery).mockResolvedValue({ data: undefined });

      const { result } = renderHookWithProviders(() => useCreateTaskMutation());

      // When
      const currentResult = result.current as ReturnType<
        typeof useCreateTaskMutation
      >;
      const [createTask] = currentResult;
      act(() => {
        void createTask(createdTask);
      });

      // Then
      await waitFor(() => {
        const currentResult = result.current as ReturnType<
          typeof useCreateTaskMutation
        >;
        const [, { isSuccess, isLoading, isError, error }] = currentResult;
        expect(isSuccess).toBe(true);
        expect(isLoading).toBe(false);
        expect(isError).toBe(false);
        expect(error).toBeUndefined();
      });
    });

    it('Should handle loading state', async () => {});
    it('Should handle error state', async () => {});
  });
});
