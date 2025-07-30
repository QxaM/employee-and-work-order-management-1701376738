import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { setupStore } from '../../src/store';
import { BrowserRouter } from 'react-router-dom';
import { describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import PasswordRequestPage from '../../src/pages/PasswordRequestPage.tsx';

const testWrapper = ({ children }: PropsWithChildren) => {
  return (
    <Provider store={setupStore()}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
};

describe('Password Request Page', () => {
  it('Should contain Password Request Form elements', () => {
    // Given
    const headerTitle = 'Enter email to reset password';
    const emailTitle = 'email';
    const loginButtonText = 'Reset Password';

    // When
    render(<PasswordRequestPage />, { wrapper: testWrapper });
    const headerElement = screen.getByText(headerTitle);
    const emailElement = screen.getByLabelText(emailTitle);
    const loginButton = screen.getByRole('button', { name: loginButtonText });

    // Then
    expect(headerElement).toBeInTheDocument();
    expect(emailElement).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });
});
