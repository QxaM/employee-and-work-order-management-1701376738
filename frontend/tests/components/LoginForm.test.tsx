import { PropsWithChildren } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, it } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import LoginForm from '../../src/components/LoginForm.tsx';
import * as useAuthModule from '../../src/hooks/useAuth.tsx';
import { TokenType } from '../../src/store/api/auth.ts';
import { renderWithProviders } from '../test-utils.tsx';

const EMAIL_TITLE = 'email address';
const PASSWORD_TITLE = 'password';
const LOGIN_BUTTON_TEXT = 'Sign in';

const TestWrapper = ({ children }: PropsWithChildren) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

describe('Login Form', () => {
  const mockReturnData: TokenType = {
    token: '12345',
    type: 'Bearer',
    expiresIn: 3600,
  };
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();

    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      login: {
        trigger: mockLogin,
        data: undefined,
        isSuccess: false,
        isPending: false,
        isError: false,
      },
      logout: {
        trigger: vi.fn(),
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Should contain necessary elements - title, inputs, button', () => {
    // Given
    const headerTitle = 'Welcome Back';

    // When
    renderWithProviders(
      <TestWrapper>
        <LoginForm />
      </TestWrapper>
    );
    const headerElement = screen.getByText(headerTitle);
    const emailElement = screen.getByLabelText(EMAIL_TITLE);
    const passwordElement = screen.getByLabelText(PASSWORD_TITLE);
    const loginButton = screen.getByRole('button', { name: LOGIN_BUTTON_TEXT });

    // Then
    expect(headerElement).toBeInTheDocument();
    expect(emailElement).toBeInTheDocument();
    expect(passwordElement).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  it('Should have register link and message and navigate to Register page', () => {
    // Given
    const registerText = "Don't have an account?";
    const registerLinkText = 'Sign up';

    renderWithProviders(
      <TestWrapper>
        <LoginForm />
      </TestWrapper>
    );
    expect(screen.getByText(registerText)).toBeInTheDocument();

    // When
    const registerLink = screen.getByRole('link', { name: registerLinkText });
    fireEvent.click(registerLink);

    // Then
    expect(window.location.pathname).toBe('/register');
  });

  it('Should login correctly', () => {
    // Given
    renderWithProviders(
      <TestWrapper>
        <LoginForm />
      </TestWrapper>
    );
    const emailElement = screen.getByLabelText(EMAIL_TITLE);
    const passwordElement = screen.getByLabelText(PASSWORD_TITLE);
    const loginButton = screen.getByRole('button', { name: LOGIN_BUTTON_TEXT });

    // When
    fireEvent.change(emailElement, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordElement, { target: { value: 'test12345' } });
    fireEvent.click(loginButton);

    // Then
    expect(mockLogin).toHaveBeenCalledOnce();
    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'test12345',
    });
  });

  it('Should render loading spinner when pending', () => {
    // Given
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      login: {
        trigger: mockLogin,
        data: mockReturnData,
        isSuccess: false,
        isPending: true,
        isError: false,
      },
      logout: {
        trigger: vi.fn(),
      },
    });

    // When
    renderWithProviders(
      <TestWrapper>
        <LoginForm />
      </TestWrapper>
    );
    const loadingSpinner = screen.getByTestId('spinner');
    const loginButton = screen.queryByRole('button', {
      name: LOGIN_BUTTON_TEXT,
    });

    // Then
    expect(loadingSpinner).toBeInTheDocument();
    expect(loginButton).not.toBeInTheDocument();
  });

  it('Should error element when error', () => {
    // Given
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      login: {
        trigger: mockLogin,
        data: mockReturnData,
        isSuccess: false,
        isPending: false,
        isError: true,
      },
      logout: {
        trigger: vi.fn(),
      },
    });

    // When
    renderWithProviders(
      <TestWrapper>
        <LoginForm />
      </TestWrapper>
    );
    const errorElement = screen.getByText(
      'Login failed. Invalid email or password.'
    );

    // Then
    expect(errorElement).toBeInTheDocument();
  });

  it('Should navigate to password reset', () => {
    // Given
    const resetNowText = 'Forgot password?';
    renderWithProviders(
      <TestWrapper>
        <LoginForm />
      </TestWrapper>
    );

    // When
    const resetNow = screen.getByRole('link', { name: resetNowText });
    fireEvent.click(resetNow);

    // Then
    expect(window.location.pathname).toBe('/password/request');
  });
});
