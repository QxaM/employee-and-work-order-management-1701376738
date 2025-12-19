import { fireEvent, render, screen } from '@testing-library/react';
import TasksListTitle from '../../../src/components/tasks/TasksListTitle.tsx';
import { afterEach, beforeEach } from 'vitest';

describe('TaskListTitle', () => {
  const totalTasks = 10;
  const openNewTaskMock = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render title', () => {
    // Given
    const title = 'Tasks';

    // When
    render(
      <TasksListTitle totalTasks={totalTasks} openNewTask={openNewTaskMock} />
    );

    const titleElement = screen.getByRole('heading', { name: title });

    // Then
    expect(titleElement).toBeInTheDocument();
  });

  it('should render subtitle', () => {
    // Given
    const subtitle = 'Select task below to view and update its details';

    // When
    render(
      <TasksListTitle totalTasks={totalTasks} openNewTask={openNewTaskMock} />
    );

    const subtitleElement = screen.getByText(subtitle);

    // Then
    expect(subtitleElement).toBeInTheDocument();
  });

  it('should render total tasks', () => {
    // Given
    const totalTasksText = `Total Tasks: ${totalTasks}`;

    // When
    render(
      <TasksListTitle totalTasks={totalTasks} openNewTask={openNewTaskMock} />
    );

    const totalTasksElement = screen.getByText(totalTasksText);

    // Then
    expect(totalTasksElement).toBeInTheDocument();
  });

  it('should render new task button', () => {
    // Given
    const newTask = 'New Task';

    // When
    render(
      <TasksListTitle totalTasks={totalTasks} openNewTask={openNewTaskMock} />
    );
    const buttonElement = screen.getByRole('button', { name: newTask });

    // Then
    expect(buttonElement).toBeInTheDocument();
  });

  it('should call openNewTask when button is clicked', () => {
    // Given
    const newTask = 'New Task';
    render(
      <TasksListTitle totalTasks={totalTasks} openNewTask={openNewTaskMock} />
    );
    const buttonElement = screen.getByRole('button', { name: newTask });

    // When
    fireEvent.click(buttonElement);

    // Then
    expect(openNewTaskMock).toHaveBeenCalledOnce();
  });
});
