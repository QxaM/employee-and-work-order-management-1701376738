import RolesUpdateTitle from '../../../../src/components/admin/roles-update/RolesUpdateTitle.tsx';
import { render, screen } from '@testing-library/react';

describe('RolesUpdateTitle', () => {
  const totalUsers = 10;

  it('Should render title', () => {
    // Given
    const title = 'User Roles Update';

    // When
    render(<RolesUpdateTitle totalUsers={totalUsers} />);
    const titleElement = screen.getByRole('heading', { name: title });

    // Then
    expect(titleElement).toBeInTheDocument();
  });

  it('Should render subtitle', () => {
    // Given
    const description = 'Select user from table below to update their role';

    // When
    render(<RolesUpdateTitle totalUsers={totalUsers} />);
    const descriptionElement = screen.getByText(description);

    // Then
    expect(descriptionElement).toBeInTheDocument();
  });

  it('Should render total users', () => {
    // Given
    const totalUsersText = `Total Users: ${totalUsers}`;

    // When
    render(<RolesUpdateTitle totalUsers={totalUsers} />);
    const descriptionElement = screen.getByText(totalUsersText);

    // Then
    expect(descriptionElement).toBeInTheDocument();
  });
});
