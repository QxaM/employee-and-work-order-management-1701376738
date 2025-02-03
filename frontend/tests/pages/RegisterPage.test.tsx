import { describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import RegisterPage from '@/pages/RegisterPage.tsx';
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { setupStore } from '@/store';

const testWrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <Provider store={setupStore()}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>{children}</BrowserRouter>
      </QueryClientProvider>
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
