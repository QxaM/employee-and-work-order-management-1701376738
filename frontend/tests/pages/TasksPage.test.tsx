import { render, screen } from '@testing-library/react';
import TasksPage from '../../src/pages/TasksPage.tsx';
import { RoleType } from '../../src/types/api/RoleTypes.ts';
import { TaskType } from '../../src/types/api/TaskTypes.ts';
import * as tasksApiModule from '../../src/store/api/task.ts';
import { beforeEach } from 'vitest';

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

  beforeEach(() => {
    vi.spyOn(tasksApiModule, 'useGetTasksQuery').mockReturnValue({
      data: tasks,
      refetch: vi.fn(),
    });
  });

  it('should render TasksListTitle', () => {
    // Given
    const headingTitle = 'Tasks';

    // When
    render(<TasksPage />);

    const headingElement = screen.getByRole('heading', { name: headingTitle });

    // Then
    expect(headingElement).toBeInTheDocument();
  });

  it('should render TasksContent', () => {
    // Given
    render(<TasksPage />);

    // When
    const idElement = screen.getByText(tasks[0].id, { exact: true });

    // Then
    expect(idElement).toBeInTheDocument();
  });
});
