import { describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import RegisterPage from '../../src/pages/RegisterPage.tsx';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { setupStore } from '../../src/store';

const testWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={setupStore()}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
};

describe('Register Page', () => {
  it('Should contain Register Form elements', () => {
    // Given
    const headerTitle = 'Enter register details';
    const emailTitle = 'email';
    const passwordTitle = 'password';
    const confirmPasswordTitle = 'confirm password';
    const signupButtonText = 'Sign up';

    // When
    render(<RegisterPage />, { wrapper: testWrapper });
    const headerElement = screen.getByText(headerTitle);
    const emailElement = screen.getByLabelText(emailTitle);
    const passwordElement = screen.getByLabelText(passwordTitle);
    const confirmPasswordElement = screen.getByLabelText(confirmPasswordTitle);
    const signupButton = screen.getByRole('button', { name: signupButtonText });

    // Then
    expect(headerElement).toBeInTheDocument();
    expect(emailElement).toBeInTheDocument();
    expect(passwordElement).toBeInTheDocument();
    expect(confirmPasswordElement).toBeInTheDocument();
    expect(signupButton).toBeInTheDocument();
  });
});
