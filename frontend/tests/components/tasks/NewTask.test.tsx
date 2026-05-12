import { fireEvent, screen } from '@testing-library/react';
import NewTask from '../../../src/components/tasks/NewTask.tsx';
import { afterEach, beforeEach } from 'vitest';
import { renderWithProviders } from '../../test-utils.tsx';
import * as usersModule from '../../../src/store/api/user.ts';
import type {
  GetUsersType,
  UserType,
} from '../../../src/types/api/UserTypes.ts';

describe('NewTask', () => {
  const onOpenChangeMock = vi.fn();

  const users: UserType[] = [
    {
      id: 1,
      email: 'test1@test.com',
      enabled: true,
      roles: [
        {
          id: 1,
          name: 'OPERATOR',
        },
      ],
    },
    {
      id: 2,
      email: 'test2@test.com',
      enabled: true,
      roles: [
        {
          id: 1,
          name: 'OPERATOR',
        },
      ],
    },
  ];

  const usersData: GetUsersType = {
    content: users,
    first: true,
    last: true,
    number: 0,
    numberOfElements: 2,
    size: 10,
    totalElements: 2,
    totalPages: 1,
  };

  beforeEach(() => {
    vi.resetAllMocks();

    vi.spyOn(usersModule, 'useGetUsersQuery').mockReturnValue({
      data: usersData,
      refetch: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render title and description', () => {
    // Given
    const title = 'Create New Task';
    const description = 'Fill in the details below to create a new task.';

    // When
    renderWithProviders(
      <NewTask open={true} onOpenChange={onOpenChangeMock} />
    );
    const titleElement = screen.getByRole('heading', { name: title });
    const descriptionElement = screen.getByText(description);

    // Then
    expect(titleElement).toBeInTheDocument();
    expect(descriptionElement).toBeInTheDocument();
  });

  it('should render form components', () => {
    // Given
    const taskTitle = 'task title';
    const descriptionTitle = 'task description';
    const assigneeTitle = 'assignee';
    const createButton = 'Create';
    const closeButton = 'Close';

    // When
    renderWithProviders(
      <NewTask open={true} onOpenChange={onOpenChangeMock} />
    );
    const taskElement = screen.getByLabelText(taskTitle);
    const descriptionElement = screen.getByLabelText(descriptionTitle);
    const assigneeElement = screen.getByLabelText(assigneeTitle);
    const createButtonElement = screen.getByRole('button', {
      name: createButton,
    });
    const closeButtonElement = screen.getByRole('button', {
      name: closeButton,
    });

    // Then
    expect(taskElement).toBeInTheDocument();
    expect(descriptionElement).toBeInTheDocument();
    expect(assigneeElement).toBeInTheDocument();
    expect(createButtonElement).toBeInTheDocument();
    expect(closeButtonElement).toBeInTheDocument();
  });

  it('should render user data for assignee select', () => {
    // Given
    renderWithProviders(
      <NewTask open={true} onOpenChange={onOpenChangeMock} />
    );
    const selectElement = screen.getByRole('combobox');

    // When
    fireEvent.click(selectElement);
    const options = screen.getAllByRole('option');
    const option1 = screen.getByRole('option', { name: users[0].email });
    const option2 = screen.getByRole('option', { name: users[1].email });

    // Then
    expect(options).toHaveLength(users.length);
    expect(option1).toBeInTheDocument();
    expect(option2).toBeInTheDocument();
  });

  it('Close should close modal', () => {
    // Given
    const closeButton = 'Close';

    renderWithProviders(
      <NewTask open={true} onOpenChange={onOpenChangeMock} />
    );
    const closeButtonElement = screen.getByRole('button', {
      name: closeButton,
    });

    // When
    fireEvent.click(closeButtonElement);

    // Then
    expect(onOpenChangeMock).toHaveBeenCalledOnce();
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
  });
});
