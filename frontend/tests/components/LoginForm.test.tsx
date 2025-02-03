import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { afterEach, beforeEach, describe, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { setupStore } from '@/store';
import LoginForm from '@/components/LoginForm.tsx';
import { QueryClientProvider, UseMutationResult } from '@tanstack/react-query';
import { queryClient } from '@/api/base.ts';
import { TokenType } from '@/types/AuthorizationTypes.ts';
import * as login from '@/api/auth.ts';

vi.mock('react-router-dom', async () => {
  const reactRouter = await vi.importActual('react-router-dom');
  return {
    ...reactRouter,
    useNavigate: vi.fn(),
  };
});

const EMAIL_TITLE = 'email';
const PASSWORD_TITLE = 'password';
const LOGIN_BUTTON_TEXT = 'Sign in';

const testWrapper = ({ children }: PropsWithChildren) => {
  return (
    <Provider store={setupStore()}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>{children}</BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
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
    const headerTitle = 'Enter login details';

    // When
    render(<LoginForm />, { wrapper: testWrapper });
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

  it('Should login correctly', () => {
    // Given
    vi.spyOn(login, 'useLoginUser').mockReturnValue({
      mutate: mockMutate,
      isSuccess: false,
      isError: false,
      isPending: false,
      error: null,
      data: mockReturnData,
    } as unknown as UseMutationResult<TokenType, Error, login.LoginRequest>);

    render(<LoginForm />, { wrapper: testWrapper });
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
      data: {
        email: 'test@test.com',
        password: 'test12345',
      },
    });
  });

  it('Should render loading spinner when pending', () => {
    // Given
    vi.spyOn(login, 'useLoginUser').mockReturnValue({
      mutate: mockMutate,
      isSuccess: false,
      isError: false,
      isPending: true,
      error: null,
      data: null,
    } as unknown as UseMutationResult<TokenType, Error, login.LoginRequest>);

    // When
    render(<LoginForm />, { wrapper: testWrapper });
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
    vi.spyOn(login, 'useLoginUser').mockReturnValue({
      mutate: mockMutate,
      isSuccess: false,
      isError: true,
      isPending: false,
      error: new Error('Test Error'),
      data: null,
    } as unknown as UseMutationResult<TokenType, Error, login.LoginRequest>);

    // When
    render(<LoginForm />, { wrapper: testWrapper });
    const errorElement = screen.getByText(
      'Login failed. Invalid email or password.'
    );

    // Then
    expect(errorElement).toBeInTheDocument();
  });

  it('Should navigate home when success', () => {
    // Given
    vi.spyOn(login, 'useLoginUser').mockReturnValue({
      mutate: mockMutate,
      isSuccess: true,
      isError: false,
      isPending: false,
      error: null,
      data: mockReturnData,
    } as unknown as UseMutationResult<TokenType, Error, login.LoginRequest>);

    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    // When
    render(<LoginForm />, { wrapper: testWrapper });

    // Then
    expect(mockNavigate).toHaveBeenCalledOnce();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
