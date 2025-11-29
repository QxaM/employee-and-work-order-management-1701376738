import { afterEach, beforeEach, expect } from 'vitest';
import { customBaseQuery } from '../../../src/store/api/base.ts';
import { PagedTasksType } from '../../../src/types/api/TaskTypes.ts';
import { loadTasks } from '../../../src/api/loaders/task.loader.ts';
import { setupStoreDispatchMock } from '../../test-utils.tsx';
import { LoaderFunctionArgs } from 'react-router-dom';

const PAGE_SIZE = 5;

vi.mock('../../../src/store/api/base.ts', async () => {
  const baseApi = await vi.importActual('../../../src/store/api/base.ts');
  return {
    ...baseApi,
    customBaseQuery: vi.fn(),
  };
});

const mockUnwrap = vi.fn();
const mockUnsubscribe = vi.fn();

const TASKS_CONTENT = [
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

const MOCK_DEFAULT_TASKS_DATA: PagedTasksType = {
  content: TASKS_CONTENT,
  first: true,
  last: true,
  number: 0,
  totalPages: 1,
  size: 5,
  numberOfElements: 1,
  totalElements: 1,
};

const MOCK_TASKS_DATA: PagedTasksType = {
  content: TASKS_CONTENT,
  first: false,
  last: true,
  number: 1,
  totalPages: 2,
  size: 5,
  numberOfElements: 1,
  totalElements: 6,
};

describe('Tasks Loader', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Should load with default page', async () => {
    // Given
    const defaultPage = 0;
    const request: Request = new Request(`http:/localhost:8000/tasks`);

    vi.mocked(customBaseQuery).mockResolvedValue({
      data: MOCK_DEFAULT_TASKS_DATA,
    });
    mockUnwrap.mockResolvedValue(MOCK_DEFAULT_TASKS_DATA);

    // When + Then
    await testTasksLoader(request, defaultPage, MOCK_DEFAULT_TASKS_DATA);
  });

  it('Should load with custom page', async () => {
    // Given
    const page = 1;
    const request: Request = new Request(
      `http:/localhost:8000/tasks?page=${page}`
    );

    vi.mocked(customBaseQuery).mockResolvedValue({
      data: MOCK_TASKS_DATA,
    });
    mockUnwrap.mockResolvedValue(MOCK_TASKS_DATA);

    // When + Then
    await testTasksLoader(request, page, MOCK_TASKS_DATA);
  });
});

const testTasksLoader = async (
  request: Request,
  correctedPage: number,
  expectedTaskData: PagedTasksType
) => {
  const defaultError = 'Unknown error while fetching tasks data';

  const { store, dispatch: spyDispatch } = setupStoreDispatchMock(
    mockUnwrap,
    mockUnsubscribe
  );

  const tasksData: PagedTasksType = await loadTasks(store, {
    params: {},
    request,
  } as LoaderFunctionArgs<unknown>);

  // Then
  expect(customBaseQuery).toHaveBeenCalledOnce();
  expect(customBaseQuery).toHaveBeenCalledWith(
    {
      url: `/task/tasks?page=${correctedPage}&size=${PAGE_SIZE}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      defaultError,
    },
    expect.any(Object),
    undefined
  );

  expect(spyDispatch).toHaveBeenCalledOnce();
  expect(mockUnwrap).toHaveBeenCalledOnce();
  expect(mockUnsubscribe).toHaveBeenCalledOnce();

  expect(tasksData).toStrictEqual(expectedTaskData);

  // Clean up
  spyDispatch.mockRestore();
};
