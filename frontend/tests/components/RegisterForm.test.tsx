import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, it, vi } from 'vitest';
import { ReactNode, useRef } from 'react';
import { BrowserRouter, useNavigate } from 'react-router-dom';

import RegisterForm from '../../src/components/RegisterForm.tsx';
import * as authApiSlice from '../../src/store/api/auth.ts';
import { Provider } from 'react-redux';
import { setupStore } from '../../src/store';
import { CustomFetchBaseQueryError } from '../../src/store/api/base.ts';

vi.mock('react', async () => {
  const react = await vi.importActual('react');
  return {
    ...react,
    useRef: vi.fn((initialValue: string) => ({
      current: initialValue,
    })),
  };
});

vi.mock('react-router-dom', async () => {
  const reactRouter = await vi.importActual('react-router-dom');
  return {
    ...reactRouter,
    useNavigate: vi.fn(),
  };
});

const EMAIL_TITLE = 'email';
const PASSWORD_TITLE = 'password';
const CONFIRM_PASSWORD_TITLE = 'confirm password';
const REGISTER_BUTTON_TEXT = 'Sign up';

const testWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={setupStore()}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
};

describe('Register Form', () => {
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.resetModules();

    vi.spyOn(authApiSlice, 'useRegisterMutation').mockReturnValue([
      mockMutate,
      {
        isSuccess: false,
        isError: false,
        isLoading: false,
        error: null,
        reset: vi.fn(),
      },
    ]);

    let refValue = '';
    vi.mocked(useRef).mockImplementation(() => ({
      get current() {
        return refValue;
      },
      set current(value) {
        refValue = value;
      },
    }));
  });

  afterEach(() => {
    vi.mocked(useRef).mockReset();
    vi.restoreAllMocks();
  });

  it('Should contain necessary elements - title, inputs, button', () => {
    // Given
    const headerTitle = 'Enter register details';

    // When
    render(<RegisterForm />, { wrapper: testWrapper });
    const headerElement = screen.getByText(headerTitle);
    const emailElement = screen.getByLabelText(EMAIL_TITLE);
    const passwordElement = screen.getByLabelText(PASSWORD_TITLE);
    const confirmPasswordElement = screen.getByLabelText(
      CONFIRM_PASSWORD_TITLE
    );

    // Then
    expect(headerElement).toBeInTheDocument();
    expect(emailElement).toBeInTheDocument();
    expect(passwordElement).toBeInTheDocument();
    expect(confirmPasswordElement).toBeInTheDocument();
  });

  it('Should have register link and message and navigate to Register page', () => {
    // Given
    const loginText = 'Already have an account?';
    const loginLinkText = 'Login';

    render(<RegisterForm />, { wrapper: testWrapper });
    expect(screen.getByText(loginText)).toBeInTheDocument();

    // When
    const registerLink = screen.getByRole('link', { name: loginLinkText });
    fireEvent.click(registerLink);

    // Then
    expect(window.location.pathname).toBe('/login');
  });

  it('Should validate confirm password correctly and throw error when confirm empty', async () => {
    // Given
    render(<RegisterForm />, { wrapper: testWrapper });
    const passwordElement = screen.getByLabelText(PASSWORD_TITLE);
    const confirmPasswordElement = screen.getByLabelText(
      CONFIRM_PASSWORD_TITLE
    );

    // When
    fireEvent.change(passwordElement, { target: { value: 'test123' } });
    fireEvent.change(confirmPasswordElement, { target: { value: 't' } });
    fireEvent.change(confirmPasswordElement, { target: { value: '' } });

    // Then
    const errorElement = await screen.findByText('Enter password confirmation');
    expect(errorElement).toBeInTheDocument();
  });

  it('Should validate confirm password correctly and throw error when confirm different', async () => {
    // Given
    render(<RegisterForm />, { wrapper: testWrapper });
    const passwordElement = screen.getByLabelText(PASSWORD_TITLE);
    const confirmPasswordElement = screen.getByLabelText(
      CONFIRM_PASSWORD_TITLE
    );

    // When
    fireEvent.change(passwordElement, { target: { value: 'test123' } });
    fireEvent.change(confirmPasswordElement, {
      target: { value: 'different' },
    });

    // Then
    const errorElement = await screen.findByText('Passwords do not match');
    expect(errorElement).toBeInTheDocument();
  });

  describe('Sing up logic', () => {
    let emailElement: HTMLElement;
    let passwordElement: HTMLElement;
    let confirmPasswordElement: HTMLElement;
    let registerButton: HTMLElement;

    beforeEach(() => {
      render(<RegisterForm />, { wrapper: testWrapper });
      emailElement = screen.getByLabelText(EMAIL_TITLE);
      passwordElement = screen.getByLabelText(PASSWORD_TITLE);
      confirmPasswordElement = screen.getByLabelText(CONFIRM_PASSWORD_TITLE);
      registerButton = screen.getByRole('button', {
        name: REGISTER_BUTTON_TEXT,
      });
    });

    it('Should register with correct data', () => {
      // Given

      // When
      fireEvent.change(emailElement, { target: { value: 'test@test.com' } });
      fireEvent.change(passwordElement, { target: { value: 'test123' } });
      fireEvent.change(confirmPasswordElement, {
        target: { value: 'test123' },
      });
      fireEvent.click(registerButton);

      //Then
      expect(mockMutate).toHaveBeenCalledOnce();
      expect(mockMutate).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'test123',
      });
    });

    it('Should not register with invalid email', () => {
      // Given

      // When
      fireEvent.change(emailElement, { target: { value: 'test.com' } });
      fireEvent.change(passwordElement, { target: { value: 'test123' } });
      fireEvent.change(confirmPasswordElement, { target: { value: 'test' } });
      fireEvent.click(registerButton);

      //Then
      expect(mockMutate).not.toHaveBeenCalledOnce();
    });

    it('Should not register with invalid password', () => {
      // Given

      // When
      fireEvent.change(emailElement, { target: { value: 'test@test.com' } });
      fireEvent.change(passwordElement, { target: { value: '' } });
      fireEvent.change(confirmPasswordElement, { target: { value: 'test' } });
      fireEvent.click(registerButton);

      //Then
      expect(mockMutate).not.toHaveBeenCalledOnce();
    });

    it('Should not register with invalid password confirmation', () => {
      // Given

      // When
      fireEvent.change(emailElement, { target: { value: 'test@test.com' } });
      fireEvent.change(passwordElement, { target: { value: 'test' } });
      fireEvent.change(confirmPasswordElement, { target: { value: '1234' } });
      fireEvent.click(registerButton);

      //Then
      expect(mockMutate).not.toHaveBeenCalledOnce();
    });
  });

  describe('Rendering mutation result elements', () => {
    it('Should render loading spinner when pending', () => {
      // Given
      vi.spyOn(authApiSlice, 'useRegisterMutation').mockReturnValue([
        mockMutate,
        {
          isSuccess: false,
          isError: false,
          isLoading: true,
          error: null,
          reset: vi.fn(),
        },
      ]);

      // When
      render(<RegisterForm />, { wrapper: testWrapper });
      const loadingSpinner = screen.getByTestId('spinner');
      const registerButton = screen.queryByRole('button', {
        name: REGISTER_BUTTON_TEXT,
      });

      // Then
      expect(loadingSpinner).toBeInTheDocument();
      expect(registerButton).not.toBeInTheDocument();
    });

    it('Should render error element when error', () => {
      // Given
      const errorMessage = 'Test Error';
      vi.spyOn(authApiSlice, 'useRegisterMutation').mockReturnValue([
        mockMutate,
        {
          isSuccess: false,
          isError: true,
          isLoading: false,
          error: {
            status: 400,
            message: errorMessage,
          } as CustomFetchBaseQueryError,
          reset: vi.fn(),
        },
      ]);

      // When
      render(<RegisterForm />, { wrapper: testWrapper });
      const errorElement = screen.getByText(errorMessage);

      // Then
      expect(errorElement).toBeInTheDocument();
    });

    it('Should navigate to home when success', () => {
      // Given
      vi.spyOn(authApiSlice, 'useRegisterMutation').mockReturnValue([
        mockMutate,
        {
          isSuccess: true,
          isError: false,
          isLoading: false,
          error: null,
          reset: vi.fn(),
        },
      ]);

      const mockNavigate = vi.fn();
      vi.mocked(useNavigate).mockReturnValue(mockNavigate);

      // When
      render(<RegisterForm />, { wrapper: testWrapper });

      // Then
      expect(mockNavigate).toHaveBeenCalledOnce();
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
