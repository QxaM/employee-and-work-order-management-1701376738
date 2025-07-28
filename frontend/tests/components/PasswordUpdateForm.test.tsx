import { fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, it, vi } from 'vitest';
import * as passwordApiSlice from '../../src/store/api/passwordReset.ts';
import { PropsWithChildren, useRef } from 'react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import PasswordUpdateForm from '../../src/components/PasswordUpdateForm.tsx';
import { renderWithProviders } from '../test-utils.tsx';
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

const TestWrapper = ({ children }: PropsWithChildren) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

const HEADER_TITLE = 'Enter new password';
const PASSWORD_TITLE = 'password';
const CONFIRM_PASSWORD_TITLE = 'confirm password';
const UPDATE_BUTTON_TEXT = 'Update Password';
const TEST_TOKEN = 'token';

describe('Password Update Form', () => {
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.resetModules();

    vi.spyOn(passwordApiSlice, 'usePasswordUpdateMutation').mockReturnValue([
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

  it('Should contain correct elements', () => {
    // Given

    // When
    renderWithProviders(
      <TestWrapper>
        <PasswordUpdateForm token={TEST_TOKEN} />
      </TestWrapper>
    );
    const headerElement = screen.getByText(HEADER_TITLE);
    const passwordElement = screen.getByLabelText(PASSWORD_TITLE);
    const confirmPasswordElement = screen.getByLabelText(
      CONFIRM_PASSWORD_TITLE
    );
    const resetButton = screen.getByRole('button', {
      name: UPDATE_BUTTON_TEXT,
    });

    // Then
    expect(headerElement).toBeInTheDocument();
    expect(passwordElement).toBeInTheDocument();
    expect(confirmPasswordElement).toBeInTheDocument();
    expect(resetButton).toBeInTheDocument();
  });

  it('Should validate confirm password correctly and throw error when confirm empty', async () => {
    // Given
    renderWithProviders(
      <TestWrapper>
        <PasswordUpdateForm token={TEST_TOKEN} />
      </TestWrapper>
    );
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
    renderWithProviders(
      <TestWrapper>
        <PasswordUpdateForm token={TEST_TOKEN} />
      </TestWrapper>
    );
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

  it('Should send request with valid data', () => {
    // Given
    const password = 'test123';
    renderWithProviders(
      <TestWrapper>
        <PasswordUpdateForm token={TEST_TOKEN} />
      </TestWrapper>
    );
    const passwordElement = screen.getByLabelText(PASSWORD_TITLE);
    const confirmPasswordElement = screen.getByLabelText(
      CONFIRM_PASSWORD_TITLE
    );
    const updateButton = screen.getByRole('button', {
      name: UPDATE_BUTTON_TEXT,
    });

    // When
    fireEvent.change(passwordElement, { target: { value: password } });
    fireEvent.change(confirmPasswordElement, {
      target: { value: password },
    });
    fireEvent.click(updateButton);

    // Then
    expect(mockMutate).toHaveBeenCalledOnce();
    expect(mockMutate).toHaveBeenCalledWith({
      token: TEST_TOKEN,
      password: password,
    });
  });

  it('Should not send request when password is empty', () => {
    // Given
    renderWithProviders(
      <TestWrapper>
        <PasswordUpdateForm token={TEST_TOKEN} />
      </TestWrapper>
    );
    const resetButton = screen.getByRole('button', {
      name: UPDATE_BUTTON_TEXT,
    });

    // When
    fireEvent.click(resetButton);

    // Then
    expect(mockMutate).not.toHaveBeenCalled();
    expect(screen.getByText('Password cannot be empty')).toBeInTheDocument();
  });

  describe('Rendering mutation result elements', () => {
    it('Should render loading spinner when pending', () => {
      // Given
      vi.spyOn(passwordApiSlice, 'usePasswordUpdateMutation').mockReturnValue([
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
      renderWithProviders(
        <TestWrapper>
          <PasswordUpdateForm token={TEST_TOKEN} />
        </TestWrapper>
      );
      const loadingSpinner = screen.getByTestId('spinner');
      const resetButton = screen.queryByRole('button', {
        name: UPDATE_BUTTON_TEXT,
      });

      // Then
      expect(loadingSpinner).toBeInTheDocument();
      expect(resetButton).not.toBeInTheDocument();
    });

    it('Should navigate to home when success', () => {
      // Given
      vi.spyOn(passwordApiSlice, 'usePasswordUpdateMutation').mockReturnValue([
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
      renderWithProviders(
        <TestWrapper>
          <PasswordUpdateForm token={TEST_TOKEN} />
        </TestWrapper>
      );

      // Then
      expect(mockNavigate).toHaveBeenCalledOnce();
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('Should register successfull modal when success', () => {
      // Given
      vi.spyOn(passwordApiSlice, 'usePasswordUpdateMutation').mockReturnValue([
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
      const { store } = renderWithProviders(
        <TestWrapper>
          <PasswordUpdateForm token={TEST_TOKEN} />
        </TestWrapper>
      );

      // Then
      expect(store.getState().modal.modals).toHaveLength(1);
      expect(store.getState().modal.modals[0]).toEqual(
        expect.objectContaining({
          content: {
            message: 'Password was updated successfully!',
            type: 'success',
          },
        })
      );
    });

    it('Should register error modal with error', () => {
      // Given
      const errorMessage = 'Test Error';
      vi.spyOn(passwordApiSlice, 'usePasswordUpdateMutation').mockReturnValue([
        mockMutate,
        {
          isSuccess: false,
          isError: true,
          isLoading: false,
          error: {
            status: 500,
            message: errorMessage,
          },
          reset: vi.fn(),
        },
      ]);

      const mockNavigate = vi.fn();
      vi.mocked(useNavigate).mockReturnValue(mockNavigate);

      // When
      const { store } = renderWithProviders(
        <TestWrapper>
          <PasswordUpdateForm token={TEST_TOKEN} />
        </TestWrapper>
      );

      // Then
      expect(store.getState().modal.modals).toHaveLength(1);
      expect(store.getState().modal.modals[0]).toEqual(
        expect.objectContaining({
          content: {
            message: errorMessage,
            type: 'error',
          },
        })
      );
    });

    it('Should register error modal with default error message', () => {
      // Given
      vi.spyOn(passwordApiSlice, 'usePasswordUpdateMutation').mockReturnValue([
        mockMutate,
        {
          isSuccess: false,
          isError: true,
          isLoading: false,
          error: {
            status: 'CUSTOM_ERROR',
            message: 'Test error',
          } as CustomFetchBaseQueryError,
          reset: vi.fn(),
        },
      ]);

      const mockNavigate = vi.fn();
      vi.mocked(useNavigate).mockReturnValue(mockNavigate);

      // When
      const { store } = renderWithProviders(
        <TestWrapper>
          <PasswordUpdateForm token={TEST_TOKEN} />
        </TestWrapper>
      );

      // Then
      expect(store.getState().modal.modals).toHaveLength(1);
      expect(store.getState().modal.modals[0]).toEqual(
        expect.objectContaining({
          content: expect.objectContaining({
            message:
              'Something went wrong during password update process. Please try again later.',
            type: 'error',
          }) as { message: string; type: string },
        })
      );
    });
  });
});
