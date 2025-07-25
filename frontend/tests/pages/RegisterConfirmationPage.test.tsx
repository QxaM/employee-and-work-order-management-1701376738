import { afterEach, beforeEach, describe, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, useNavigate, useSearchParams } from 'react-router-dom';

import RegisterConfirmationPage from '../../src/pages/RegisterConfirmationPage.tsx';
import { setupStore } from '../../src/store';
import * as authApiSlice from '../../src/store/api/auth.ts';
import * as store from '../../src/hooks/useStore.tsx';

vi.mock('react-router-dom', async () => {
  const reactRouter = await vi.importActual('react-router-dom');
  return {
    ...reactRouter,
    useNavigate: vi.fn(),
    useSearchParams: vi.fn(),
  };
});

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

describe('RegisterConfirmationPage', () => {
  const mockMutate = vi.fn();
  const mockNavigate = vi.fn();
  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.resetModules();

    vi.spyOn(authApiSlice, 'useConfirmRegistrationMutation').mockReturnValue([
      mockMutate,
      {
        isSuccess: false,
        isError: false,
        isLoading: false,
        error: null,
        reset: vi.fn(),
      },
    ]);

    vi.spyOn(store, 'useAppDispatch').mockReturnValue(mockDispatch);

    const mockUrlParams = new URLSearchParams('?token=test-token');
    vi.mocked(useSearchParams).mockReturnValue([mockUrlParams, vi.fn()]);

    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Should render LoadingSpinner by default', () => {
    // Given

    // When
    render(<RegisterConfirmationPage />, { wrapper: testWrapper });
    const loadingSpinner = screen.getByTestId('spinner');

    // Then
    expect(loadingSpinner).toBeInTheDocument();
  });

  it('Should trigger confirmation check when loaded', async () => {
    // Given

    // When
    render(<RegisterConfirmationPage />, { wrapper: testWrapper });

    // Then
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledOnce();
      expect(mockMutate).toHaveBeenCalledWith('test-token');
    });
  });

  it('Should use empty string when token empty', async () => {
    // Given
    const mockUrlParams = new URLSearchParams('?test=test');
    vi.mocked(useSearchParams).mockReturnValue([mockUrlParams, vi.fn()]);

    render(<RegisterConfirmationPage />, { wrapper: testWrapper });

    // Then
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledOnce();
      expect(mockMutate).toHaveBeenCalledWith('');
    });
  });

  describe('Navigation after confirmation', () => {
    it('Should navigate home on success', async () => {
      // Given
      vi.spyOn(authApiSlice, 'useConfirmRegistrationMutation').mockReturnValue([
        mockMutate,
        {
          isSuccess: true,
          isError: false,
          isLoading: false,
          error: null,
          reset: vi.fn(),
        },
      ]);

      // When
      render(<RegisterConfirmationPage />, { wrapper: testWrapper });

      // Then
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledOnce();
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('Should navigate home on error', async () => {
      // Given
      const errorMessage = 'Test Error';
      vi.spyOn(authApiSlice, 'useConfirmRegistrationMutation').mockReturnValue([
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

      // When
      render(<RegisterConfirmationPage />, { wrapper: testWrapper });

      // Then
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledOnce();
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });
  });

  describe('Modals after confirmation', () => {
    it('Should show success', async () => {
      // Given
      vi.spyOn(authApiSlice, 'useConfirmRegistrationMutation').mockReturnValue([
        mockMutate,
        {
          isSuccess: true,
          isError: false,
          isLoading: false,
          error: null,
          reset: vi.fn(),
        },
      ]);

      // When
      render(<RegisterConfirmationPage />, { wrapper: testWrapper });

      // Then
      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledOnce();
        expect(mockDispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'modal/registerModal',
          })
        );
        expect(mockDispatch).toHaveBeenCalledWith(
          expect.objectContaining<Record<string, unknown>>({
            payload: expect.objectContaining<Record<string, unknown>>({
              content: {
                message: 'Verification was successfull - you can now login',
                type: 'success',
                hideTimeout: 30000,
              },
            }),
          })
        );
      });
    });

    it('Should show error', async () => {
      // Given
      const errorMessage = 'Test Error';
      vi.spyOn(authApiSlice, 'useConfirmRegistrationMutation').mockReturnValue([
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

      // When
      render(<RegisterConfirmationPage />, { wrapper: testWrapper });

      // Then
      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledOnce();
        expect(mockDispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'modal/registerModal',
          })
        );
        expect(mockDispatch).toHaveBeenCalledWith(
          expect.objectContaining<Record<string, unknown>>({
            payload: expect.objectContaining<Record<string, unknown>>({
              content: {
                message: errorMessage,
                type: 'error',
              },
            }),
          })
        );
      });
    });
  });
});
