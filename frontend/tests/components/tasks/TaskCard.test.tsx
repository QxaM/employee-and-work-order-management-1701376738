import { TaskType } from '../../../src/types/api/TaskTypes.ts';
import { RoleType } from '../../../src/types/api/RoleTypes.ts';
import { render, screen } from '@testing-library/react';
import TaskCard from '../../../src/components/tasks/TaskCard.tsx';

describe('TaskCard', () => {
  describe('render elements', () => {
    const role: RoleType = {
      id: 1,
      name: 'ROLE_TEST',
    };
    const user: TaskType['user'] = {
      id: 10,
      email: 'test@test.com',
      roles: [role],
    };
    const task: TaskType = {
      id: 101,
      title: 'Test task 2',
      description: 'Test description 2',
      user: user,
    };

    it('should render status icon', () => {
      // Given
      const testId = 'status-icon';
      render(<TaskCard task={task} />);

      // When
      const statusIcon = screen.getByTestId(testId);

      // Then
      expect(statusIcon).toBeInTheDocument();
    });

    it('should render task data', () => {
      // Given
      render(<TaskCard task={task} />);

      // When
      const idElement = screen.getByText(`#${task.id}`, { exact: true });
      const titleElement = screen.getByText(task.title, { exact: false });
      const assigneeElement = screen.getByText(user.email, { exact: false });

      // Then
      expect(idElement).toBeInTheDocument();
      expect(titleElement).toBeInTheDocument();
      expect(assigneeElement).toBeInTheDocument();
    });

    it('should render task status badge', () => {
      // Given
      const badgeText = 'In progress';
      render(<TaskCard task={task} />);

      // When
      const statusBadgeElement = screen.getByText(badgeText, { exact: true });

      // Then
      expect(statusBadgeElement).toBeInTheDocument();
    });
  });
});
