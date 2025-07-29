import { MeType } from '../../../../../src/store/api/auth.ts';
import WelcomeMessage from '../../../../../src/components/shared/navigation/MainNavigation/WelcomeMessage.tsx';
import { render, screen } from '@testing-library/react';

describe('Welcome Message', () => {
  it('should render welcome message with data', () => {
    // Given
    const me: MeType = {
      email: 'test@test.com',
      roles: [
        {
          id: 1,
          name: 'ADMIN',
        },
      ],
    };
    const message = `Welcome back, ${me.email}!`;

    // When
    render(<WelcomeMessage me={me} />);
    const messageElement = screen.getByText(message);

    // Then
    expect(messageElement).toBeInTheDocument();
  });

  it('should render welcome message without data', () => {
    // Given
    const message = `Welcome back!`;

    // When
    render(<WelcomeMessage />);
    const messageElement = screen.getByText(message);

    // Then
    expect(messageElement).toBeInTheDocument();
  });
});
