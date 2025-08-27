import { PropsWithChildren } from 'react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { afterEach, beforeEach, describe, it } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import LoginForm from '../../src/components/LoginForm.tsx';
import * as authApiSlice from '../../src/store/api/auth.ts';
import { TokenType } from '../../src/store/api/auth.ts';
import { renderWithProviders } from '../test-utils.tsx';

vi.mock('react-router-dom', async () => {
  const reactRouter = await vi.importActual('react-router-dom');
  return {
    ...reactRouter,
    useNavigate: vi.fn(),
  };
});

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

  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.resetModules();
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
    vi.spyOn(authApiSlice, 'useLoginMutation').mockReturnValue([
      mockMutate,
      {
        data: mockReturnData,
        isSuccess: false,
        isLoading: false,
        isError: false,
        error: null,
        reset: vi.fn(),
      },
    ]);

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
    expect(mockMutate).toHaveBeenCalledOnce();
    expect(mockMutate).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'test12345',
    });
  });

  it('Should render loading spinner when pending', () => {
    // Given
    vi.spyOn(authApiSlice, 'useLoginMutation').mockReturnValue([
      mockMutate,
      {
        data: mockReturnData,
        isSuccess: false,
        isLoading: true,
        isError: false,
        error: null,
        reset: vi.fn(),
      },
    ]);

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
    const errorMessage = 'Test Error';
    vi.spyOn(authApiSlice, 'useLoginMutation').mockReturnValue([
      mockMutate,
      {
        data: mockReturnData,
        isSuccess: false,
        isLoading: false,
        isError: true,
        error: {
          status: 500,
          message: errorMessage,
        },
        reset: vi.fn(),
      },
    ]);

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

  it('Should navigate home when success', () => {
    // Given
    vi.spyOn(authApiSlice, 'useLoginMutation').mockReturnValue([
      mockMutate,
      {
        data: mockReturnData,
        isSuccess: true,
        isLoading: false,
        isError: false,
        error: null,
        reset: vi.fn(),
      },
    ]);

    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    // When
    renderWithProviders(
      <TestWrapper>
        <LoginForm />
      </TestWrapper>
    );

    // Then
    expect(mockNavigate).toHaveBeenCalledOnce();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('Should handle login action correctly', () => {
    // Given
    const localStorageMock = {
      setItem: vi.fn(),
    };
    vi.stubGlobal('localStorage', localStorageMock);

    vi.spyOn(authApiSlice, 'useLoginMutation').mockReturnValue([
      mockMutate,
      {
        data: mockReturnData,
        isSuccess: true,
        isLoading: false,
        isError: false,
        error: null,
        reset: vi.fn(),
      },
    ]);

    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    // When
    const { store } = renderWithProviders(
      <TestWrapper>
        <LoginForm />
      </TestWrapper>
    );

    // Then
    expect(store.getState().auth.token).toEqual(mockReturnData.token);
    expect(localStorageMock.setItem).toHaveBeenCalledOnce();
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'token',
      mockReturnData.token
    );
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
