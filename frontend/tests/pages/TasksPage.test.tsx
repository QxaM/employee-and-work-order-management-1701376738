import {render, screen} from '@testing-library/react';
import TasksPage from '../../src/pages/TasksPage.tsx';
import {RoleType} from '../../src/types/api/RoleTypes.ts';
import {PagedTasksType, TaskType} from '../../src/types/api/TaskTypes.ts';
import * as tasksApiModule from '../../src/store/api/task.ts';
import {beforeEach} from 'vitest';
import {BrowserRouter} from 'react-router-dom';

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

  it('should render TasksListTitle', () => {
    // Given
    const headingTitle = 'Tasks';

    // When
    render(<TasksPage />, { wrapper: BrowserRouter });

    const headingElement = screen.getByRole('heading', { name: headingTitle });

    // Then
    expect(headingElement).toBeInTheDocument();
  });

  it('should render TasksContent', () => {
    // Given
    render(<TasksPage />, { wrapper: BrowserRouter });

    // When
    const idElement = screen.getByText(`#${tasks[0].id}`, { exact: true });

    // Then
    expect(idElement).toBeInTheDocument();
  });
});
