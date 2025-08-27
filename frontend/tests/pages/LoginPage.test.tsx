import { describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';

import { setupStore } from '../../src/store';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../../src/pages/LoginPage.tsx';

const testWrapper = ({ children }: PropsWithChildren) => {
  return (
    <Provider store={setupStore()}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
};

describe('Login Page', () => {
  it('Should contain Login Form elements', () => {
    // Given
    const headerTitle = 'Welcome Back';
    const emailTitle = 'email address';
    const passwordTitle = 'password';
    const loginButtonText = 'Sign in';

    // When
    render(<LoginPage />, { wrapper: testWrapper });
    const headerElement = screen.getByText(headerTitle);
    const emailElement = screen.getByLabelText(emailTitle);
    const passwordElement = screen.getByLabelText(passwordTitle);
    const loginButton = screen.getByRole('button', { name: loginButtonText });

    // Then
    expect(headerElement).toBeInTheDocument();
    expect(emailElement).toBeInTheDocument();
    expect(passwordElement).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });
});
