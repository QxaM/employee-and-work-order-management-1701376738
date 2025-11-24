import { afterEach, beforeEach, expect } from 'vitest';
import { customBaseQuery } from '../../../src/store/api/base.ts';
import { TaskType } from '../../../src/types/api/TaskTypes.ts';
import { loadTasks } from '../../../src/api/loaders/task.loader.ts';
import { setupStoreDispatchMock } from '../../test-utils.tsx';

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

const MOCK_DEFAULT_TASKS_DATA = TASKS_CONTENT;

describe('Tasks Loader', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    vi.mocked(customBaseQuery).mockResolvedValue({
      data: MOCK_DEFAULT_TASKS_DATA,
    });
    mockUnwrap.mockResolvedValue(MOCK_DEFAULT_TASKS_DATA);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Should load', async () => {
    // Given

    // When + Then
    await testTasksLoader(MOCK_DEFAULT_TASKS_DATA);
  });
});

const testTasksLoader = async (expectedTaskData: TaskType[]) => {
  const defaultError = 'Unknown error while fetching tasks data';

  const { store, dispatch: spyDispatch } = setupStoreDispatchMock(
    mockUnwrap,
    mockUnsubscribe
  );

  const tasksData: TaskType[] = await loadTasks(store);

  // Then
  expect(customBaseQuery).toHaveBeenCalledOnce();
  expect(customBaseQuery).toHaveBeenCalledWith(
    {
      url: `/task/tasks`,
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
