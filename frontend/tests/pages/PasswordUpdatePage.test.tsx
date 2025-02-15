import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { setupStore } from '../../src/store';
import { BrowserRouter } from 'react-router-dom';
import { describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import PasswordUpdatePage from '../../src/pages/PasswordUpdatePage.tsx';

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

describe('Password Update Page', () => {
  it('Should contain Password Update Form elements', () => {
    // Given
    const headerTitle = 'Enter new password';
    const passwordTitle = 'password';
    const confirmPasswordTitle = 'confirm password';
    const resetButtonText = 'Update Password';

    // When
    render(<PasswordUpdatePage />, { wrapper: testWrapper });
    const headerElement = screen.getByText(headerTitle);
    const passwordElement = screen.getByLabelText(passwordTitle);
    const confirmPasswordElement = screen.getByLabelText(confirmPasswordTitle);
    const resetButton = screen.getByRole('button', { name: resetButtonText });

    // Then
    expect(headerElement).toBeInTheDocument();
    expect(passwordElement).toBeInTheDocument();
    expect(confirmPasswordElement).toBeInTheDocument();
    expect(resetButton).toBeInTheDocument();
  });
});
