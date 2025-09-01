import ProfileControls from '../../../src/components/profile/ProfileControls.tsx';
import { Form } from 'radix-ui';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach } from 'vitest';
import { FormEvent, PropsWithChildren } from 'react';

const TestWrapper = ({ children }: PropsWithChildren) => {
  return (
    <Form.Root
      onSubmit={vi
        .fn()
        .mockImplementation((event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
        })}
    >
      {children}
    </Form.Root>
  );
};

describe('ProfileControls', () => {
  const mockHandleEdit = vi.fn();
  const mockHandleCancel = vi.fn();

  const editTitle = 'Edit profile';
  const saveChangesTitle = 'Save changes';
  const cancelTitle = 'Cancel';

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('Should contain edit button, when not editing', () => {
    // Given
    const isEditing = false;
    render(
      <ProfileControls
        isEdited={isEditing}
        onEdit={mockHandleEdit}
        onCancel={mockHandleCancel}
      />,
      { wrapper: TestWrapper }
    );

    // When
    const editButton = screen.getByRole('button', { name: editTitle });

    // Then
    expect(editButton).toBeInTheDocument();
  });

  it('Should contain save and cancel buttons, when editing', () => {
    // Given
    const isEditing = true;
    render(
      <ProfileControls
        isEdited={isEditing}
        onEdit={mockHandleEdit}
        onCancel={mockHandleCancel}
      />,
      { wrapper: TestWrapper }
    );

    // When
    const saveButton = screen.getByRole('button', { name: saveChangesTitle });
    const cancelButton = screen.getByRole('button', { name: cancelTitle });

    // Then
    expect(saveButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });

  it('Should call handleEdit on edit button click', () => {
    // Given
    const isEditing = false;
    render(
      <ProfileControls
        isEdited={isEditing}
        onEdit={mockHandleEdit}
        onCancel={mockHandleCancel}
      />,
      { wrapper: TestWrapper }
    );
    const editButton = screen.getByRole('button', { name: editTitle });

    // When
    fireEvent.click(editButton);

    // Then
    expect(mockHandleEdit).toHaveBeenCalledOnce();
  });

  it('Should call handleCancel on cancel button click', () => {
    // Given
    const isEditing = true;
    render(
      <ProfileControls
        isEdited={isEditing}
        onEdit={mockHandleEdit}
        onCancel={mockHandleCancel}
      />,
      { wrapper: TestWrapper }
    );
    const cancelButton = screen.getByRole('button', { name: cancelTitle });

    // When
    fireEvent.click(cancelButton);

    // Then
    expect(mockHandleCancel).toHaveBeenCalledOnce();
  });
});
