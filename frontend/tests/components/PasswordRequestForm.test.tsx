import { PropsWithChildren, useRef } from 'react';
import { QueryClientProvider, UseMutationResult } from '@tanstack/react-query';
import { queryClient } from '../../src/api/base.ts';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { afterEach, beforeEach, describe, vi } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import PasswordRequestForm from '../../src/components/PasswordRequestForm.tsx';
import { renderWithProviders } from '../test-utils.tsx';
import * as requestReset from '../../src/api/passwordReset.ts';

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
const RESET_BUTTON_TEXT = 'Reset Password';

const TestWrapper = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Password Request Form', () => {
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.resetModules();

    vi.spyOn(requestReset, 'useResetRequest').mockReturnValue({
      mutate: mockMutate,
      isSuccess: false,
      isError: false,
      isPending: false,
      error: null,
    } as unknown as UseMutationResult<
      void,
      Error,
      requestReset.PasswordResetRequest
    >);

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

  it('Should contain necessary elements - title, input, button', () => {
    // Given
    const headerTitle = 'Enter email to reset password';

    // When
    renderWithProviders(
      <TestWrapper>
        <PasswordRequestForm />
      </TestWrapper>
    );
    const headerElement = screen.getByText(headerTitle);
    const emailElement = screen.getByLabelText(EMAIL_TITLE);
    const resetButton = screen.getByRole('button', { name: RESET_BUTTON_TEXT });

    // Then
    expect(headerElement).toBeInTheDocument();
    expect(emailElement).toBeInTheDocument();
    expect(resetButton).toBeInTheDocument();
  });

  it('Should send request with valid data', () => {
    // Given
    renderWithProviders(
      <TestWrapper>
        <PasswordRequestForm />
      </TestWrapper>
    );
    const emailElement = screen.getByLabelText(EMAIL_TITLE);
    const resetButton = screen.getByRole('button', { name: RESET_BUTTON_TEXT });

    // When
    fireEvent.change(emailElement, { target: { value: 'test@test.com' } });
    fireEvent.click(resetButton);

    // Then
    expect(mockMutate).toHaveBeenCalledOnce();
    expect(mockMutate).toHaveBeenCalledWith({
      email: 'test@test.com',
    });
  });

  it('Should not send request with invalid data', () => {
    // Given
    renderWithProviders(
      <TestWrapper>
        <PasswordRequestForm />
      </TestWrapper>
    );
    const emailElement = screen.getByLabelText(EMAIL_TITLE);
    const resetButton = screen.getByRole('button', { name: RESET_BUTTON_TEXT });

    // When
    fireEvent.change(emailElement, { target: { value: 'test' } });
    fireEvent.click(resetButton);

    // Then
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('Should not send request when email is empty', () => {
    // Given
    renderWithProviders(
      <TestWrapper>
        <PasswordRequestForm />
      </TestWrapper>
    );
    const resetButton = screen.getByRole('button', { name: RESET_BUTTON_TEXT });

    // When
    fireEvent.click(resetButton);

    // Then
    expect(mockMutate).not.toHaveBeenCalled();
    expect(screen.getByText('Enter valid email address')).toBeInTheDocument();
  });

  describe('Rendering mutation result elements', () => {
    it('Should render loading spinner when pending', () => {
      // Given
      vi.spyOn(requestReset, 'useResetRequest').mockReturnValue({
        mutate: mockMutate,
        isSuccess: false,
        isError: false,
        isPending: true,
        error: null,
      } as unknown as UseMutationResult<
        void,
        Error,
        requestReset.PasswordResetRequest
      >);

      // When
      renderWithProviders(
        <TestWrapper>
          <PasswordRequestForm />
        </TestWrapper>
      );
      const loadingSpinner = screen.getByTestId('spinner');
      const resetButton = screen.queryByRole('button', {
        name: RESET_BUTTON_TEXT,
      });

      // Then
      expect(loadingSpinner).toBeInTheDocument();
      expect(resetButton).not.toBeInTheDocument();
    });

    it('Should render error element when error', () => {
      // Given
      vi.spyOn(requestReset, 'useResetRequest').mockReturnValue({
        mutate: mockMutate,
        isSuccess: false,
        isError: true,
        isPending: false,
        error: new Error('Test Error'),
      } as unknown as UseMutationResult<
        void,
        Error,
        requestReset.PasswordResetRequest
      >);

      // When
      renderWithProviders(
        <TestWrapper>
          <PasswordRequestForm />
        </TestWrapper>
      );
      const errorElement = screen.getByText('Test Error');

      // Then
      expect(errorElement).toBeInTheDocument();
    });

    it('Should navigate to home when success', () => {
      // Given
      vi.spyOn(requestReset, 'useResetRequest').mockReturnValue({
        mutate: mockMutate,
        isSuccess: true,
        isError: false,
        isPending: false,
        error: null,
      } as unknown as UseMutationResult<
        void,
        Error,
        requestReset.PasswordResetRequest
      >);

      const mockNavigate = vi.fn();
      vi.mocked(useNavigate).mockReturnValue(mockNavigate);

      // When
      renderWithProviders(
        <TestWrapper>
          <PasswordRequestForm />
        </TestWrapper>
      );

      // Then
      expect(mockNavigate).toHaveBeenCalledOnce();
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('Should register successfull modal when success', () => {
      // Given
      vi.spyOn(requestReset, 'useResetRequest').mockReturnValue({
        mutate: mockMutate,
        isSuccess: true,
        isError: false,
        isPending: false,
        error: null,
      } as unknown as UseMutationResult<
        void,
        Error,
        requestReset.PasswordResetRequest
      >);

      const mockNavigate = vi.fn();
      vi.mocked(useNavigate).mockReturnValue(mockNavigate);

      // When
      const { store } = renderWithProviders(
        <TestWrapper>
          <PasswordRequestForm />
        </TestWrapper>
      );

      // Then
      expect(store.getState().modal.modals).toHaveLength(1);
      expect(store.getState().modal.modals[0]).toEqual(
        expect.objectContaining({
          content: {
            message: 'Email was sent if provided email exists in our database.',
            type: 'success',
          },
        })
      );
    });
  });
});
