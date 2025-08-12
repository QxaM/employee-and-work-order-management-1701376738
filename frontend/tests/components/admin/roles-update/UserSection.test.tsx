import { describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import UserSection from '../../../../src/components/admin/roles-update/UserSection.tsx';

const title = 'Test User';
const user = {
  id: 1,
  email: 'test@test.com',
};

describe('UserSection', () => {
  it('Should render user data section title', () => {
    // Given
    render(<UserSection title={title} userId={user.id} email={user.email} />);

    // When
    const titleElement = screen.getByText(title);
    const userData = screen.getByLabelText(title);

    // Then
    expect(titleElement).toBeInTheDocument();
    expect(userData).toBeInTheDocument();
  });

  it('Should render user ID', () => {
    // Given
    const userIdTitle = 'User ID';
    render(<UserSection title={title} userId={user.id} email={user.email} />);

    // When
    const userId = screen.getByText(userIdTitle);
    const userIdValue = screen.getByText(user.id);

    // Then
    expect(userId).toBeInTheDocument();
    expect(userIdValue).toBeInTheDocument();
  });

  it('Should render user email', () => {
    // Given
    const userEmailTitle = 'User email';
    render(<UserSection title={title} userId={user.id} email={user.email} />);

    // When
    const userEmail = screen.getByText(userEmailTitle);
    const userEmailValue = screen.getByText(user.email);

    // Then
    expect(userEmail).toBeInTheDocument();
    expect(userEmailValue).toBeInTheDocument();
  });
});
