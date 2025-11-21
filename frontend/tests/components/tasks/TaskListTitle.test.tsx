import { render, screen } from '@testing-library/react';
import TasksListTitle from '../../../src/components/tasks/TasksListTitle.tsx';

describe('TaskListTitle', () => {
  const totalTasks = 10;

  it('should render title', () => {
    // Given
    const title = 'Tasks';

    // When
    render(<TasksListTitle totalTasks={totalTasks} />);

    const titleElement = screen.getByRole('heading', { name: title });

    // Then
    expect(titleElement).toBeInTheDocument();
  });

  it('should render subtitle', () => {
    // Given
    const subtitle = 'Select task below to view and update its details';

    // When
    render(<TasksListTitle totalTasks={totalTasks} />);

    const subtitleElement = screen.getByText(subtitle);

    // Then
    expect(subtitleElement).toBeInTheDocument();
  });

  it('should render total tasks', () => {
    // Given
    const totalTasksText = `Total Tasks: ${totalTasks}`;

    // When
    render(<TasksListTitle totalTasks={totalTasks} />);

    const totalTasksElement = screen.getByText(totalTasksText);

    // Then
    expect(totalTasksElement).toBeInTheDocument();
  });
});
