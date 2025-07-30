import { fireEvent, render, screen } from '@testing-library/react';
import RoleControl from '../../../../src/components/admin/roles-update/RoleControl.tsx';
import { expect } from 'vitest';

describe('RoleControl', () => {
  const addRoleLabel = 'add role';
  const removeRoleLabel = 'remove role';

  it('Should render add and remove roles buttons', () => {
    // Given
    render(<RoleControl onAddRole={vi.fn()} onRemoveRole={vi.fn()} />);

    // When
    const addRoleButton = screen.getByLabelText(addRoleLabel);
    const removeRoleButton = screen.getByLabelText(removeRoleLabel);

    // Then
    expect(addRoleButton).toBeInTheDocument();
    expect(removeRoleButton).toBeInTheDocument();
  });

  it('Should execute add role', () => {
    // Given
    const mockAddRole = vi.fn();
    render(<RoleControl onAddRole={mockAddRole} onRemoveRole={vi.fn()} />);
    const addRoleButton = screen.getByLabelText(addRoleLabel);

    // When
    fireEvent.click(addRoleButton);

    // Then
    expect(mockAddRole).toHaveBeenCalledOnce();
  });

  it('Should execute add role', () => {
    // Given
    const mockRemoveRole = vi.fn();
    render(<RoleControl onAddRole={vi.fn()} onRemoveRole={mockRemoveRole} />);
    const removeRoleButton = screen.getByLabelText(removeRoleLabel);

    // When
    fireEvent.click(removeRoleButton);

    // Then
    expect(mockRemoveRole).toHaveBeenCalledOnce();
  });
});
