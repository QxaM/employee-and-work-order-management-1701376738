import { TaskType } from '../../../src/types/api/TaskTypes.ts';
import { RoleType } from '../../../src/types/api/RoleTypes.ts';
import { render, screen } from '@testing-library/react';
import TasksContent from '../../../src/components/tasks/TasksContent.tsx';

describe('TaskContent', () => {
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

  it('should render task content', () => {
    // Given
    render(<TasksContent tasks={tasks} />);

    // When
    const taskId = screen.getByText(tasks[0].id, { exact: true });

    // Then
    expect(taskId).toBeInTheDocument();
  });
});
