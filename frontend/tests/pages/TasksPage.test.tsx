import { act, fireEvent, screen } from '@testing-library/react';
import TasksPage from '../../src/pages/TasksPage.tsx';
import type { RoleType } from '../../src/types/api/RoleTypes.ts';
import type {
  PagedTasksType,
  TaskType,
} from '../../src/types/api/TaskTypes.ts';
import * as tasksApiModule from '../../src/store/api/task.ts';
import { beforeEach } from 'vitest';
import { BrowserRouter, RouterProvider } from 'react-router-dom';
import { createDataRouter, renderWithProviders } from '../test-utils.tsx';

describe('TasksPage', () => {
  const role: RoleType = {
    id: 1,
    name: 'ROLE_TEST',
  };
  const user: TaskType['user'] = {
    id: 10,
    email: 'test@test.com',
    roles: [role],
  };
  const tasks: TaskType[] = [
    {
      id: 100,
      title: 'Test task',
      description: 'Test description',
      user: user,
    },
  ];
  const pagedTasks: PagedTasksType = {
    content: tasks,
    first: true,
    last: true,
    number: 0,
    numberOfElements: 1,
    size: 5,
    totalElements: 1,
    totalPages: 1,
  };

  beforeEach(() => {
    vi.spyOn(tasksApiModule, 'useGetTasksQuery').mockReturnValue({
      data: pagedTasks,
      refetch: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render TasksListTitle', () => {
    // Given
    const headingTitle = 'Tasks';

    // When
    renderWithProviders(<TasksPage />, { wrapper: BrowserRouter });

    const headingElement = screen.getByRole('heading', { name: headingTitle });

    // Then
    expect(headingElement).toBeInTheDocument();
  });

  it('should render TasksContent', () => {
    // Given
    renderWithProviders(<TasksPage />, { wrapper: BrowserRouter });

    // When
    const idElement = screen.getByText(`#${tasks[0].id}`, { exact: true });

    // Then
    expect(idElement).toBeInTheDocument();
  });

  it('should open New Task modal', async () => {
    // Given
    const newTask = 'New Task';
    const newTaskDialogTitle = 'Create New Task';
    renderWithProviders(<TasksPage />, { wrapper: BrowserRouter });
    const newTaskButton = screen.getByRole('button', { name: newTask });

    // When
    act(() => {
      fireEvent.click(newTaskButton);
    });
    const newTaskModal = await screen.findByRole('heading', {
      name: newTaskDialogTitle,
    });

    // Then
    expect(newTaskModal).toBeInTheDocument();
  });

  describe('Page management', () => {
    const path = '/tasks';

    const mockPageData: PagedTasksType = {
      content: tasks,
      first: false,
      last: true,
      number: 1,
      totalPages: 2,
      size: 1,
      numberOfElements: 1,
      totalElements: 2,
    };

    it('should render Pageable', async () => {
      // Given
      const pageableLabel = 'pagination control';
      const mockLoader = vi.fn().mockReturnValue(mockPageData);

      const router = createDataRouter(path, <TasksPage />, mockLoader);
      renderWithProviders(<RouterProvider router={router} />);

      // When
      const pageable = await screen.findByLabelText(pageableLabel);

      // Then
      expect(pageable).toBeInTheDocument();
    });

    it('should reload data when page changes', async () => {
      // Given
      const nextPageLabel = 'next page';
      const mockLoader = vi.fn().mockReturnValue(mockPageData);
      vi.spyOn(tasksApiModule, 'useGetTasksQuery').mockReturnValue({
        data: mockPageData,
        isSuccess: true,
        isError: false,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      const router = createDataRouter(path, <TasksPage />, mockLoader);
      renderWithProviders(<RouterProvider router={router} />);

      const nextPage = await screen.findByLabelText(nextPageLabel);
      const nextPageNumber = mockPageData.number + 1;

      // When
      fireEvent.click(nextPage);

      // Then
      expect(mockLoader).toHaveBeenCalledTimes(2);
      expect(mockLoader).toHaveBeenCalledWith(
        expect.objectContaining({
          request: expect.objectContaining({
            url: expect.stringContaining(`page=${nextPageNumber}`) as string,
          }) as Partial<Request>,
        })
      );
    });
  });
});
