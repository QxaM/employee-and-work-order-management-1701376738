import { afterEach, beforeEach, describe } from 'vitest';
import { screen } from '@testing-library/react';

import * as useMeDataModule from '../../../src/hooks/useMeData';
import { renderWithProviders } from '../../test-utils.tsx';
import ProtectedRoute from '../../../src/components/shared/ProtectedRoute.tsx';
import { BrowserRouter } from 'react-router-dom';

describe('Protected Route', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Modal dispatch', () => {
    it('should dispatch not logged in modal', () => {
      // Given
      vi.spyOn(useMeDataModule, 'useMeData').mockReturnValue({
        me: undefined,
        isLoading: false,
        isError: true,
      });

      // When
      const { store } = renderWithProviders(
        <BrowserRouter>
          <ProtectedRoute>Test children</ProtectedRoute>
        </BrowserRouter>
      );

      // Then
      const modalState = store.getState().modal;
      expect(modalState.modals).toHaveLength(1);
      expect(modalState.modals[0].content).toStrictEqual({
        message: 'You are not logged in! Please log in.',
        type: 'info',
      });
    });

    it('should dispatch not authorized modal', () => {
      // Given
      vi.spyOn(useMeDataModule, 'useMeData').mockReturnValue({
        me: {
          email: 'test@test.com',
          roles: [
            {
              id: 1,
              name: 'OPERATOR',
            },
          ],
        },
        isLoading: false,
        isError: false,
      });

      // When
      const { store } = renderWithProviders(
        <BrowserRouter>
          <ProtectedRoute roles={['ADMIN']}>Test children</ProtectedRoute>
        </BrowserRouter>
      );

      // Then
      const modalState = store.getState().modal;
      expect(modalState.modals).toHaveLength(1);
      expect(modalState.modals[0].content).toStrictEqual({
        message: 'You are not authorized to access this page. Please log in.',
        type: 'info',
      });
    });
  });

  it('should render nothing when loading', () => {
    // Given
    vi.spyOn(useMeDataModule, 'useMeData').mockReturnValue({
      me: undefined,
      isLoading: true,
      isError: false,
    });

    // When
    const { container } = renderWithProviders(
      <BrowserRouter>
        <ProtectedRoute>Test children</ProtectedRoute>
      </BrowserRouter>
    );

    // Then
    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it('should navigate to login if not logged in', () => {
    // Given
    vi.spyOn(useMeDataModule, 'useMeData').mockReturnValue({
      me: undefined,
      isLoading: false,
      isError: true,
    });

    // When
    renderWithProviders(
      <BrowserRouter>
        <ProtectedRoute>Test children</ProtectedRoute>
      </BrowserRouter>
    );

    // Then
    expect(window.location.pathname).toBe('/login');
  });

  it('should navigate to home when not authorized', () => {
    // Given
    vi.spyOn(useMeDataModule, 'useMeData').mockReturnValue({
      me: {
        email: 'test@test.com',
        roles: [
          {
            id: 1,
            name: 'OPERATOR',
          },
        ],
      },
      isLoading: false,
      isError: false,
    });

    // When
    renderWithProviders(
      <BrowserRouter>
        <ProtectedRoute roles={['ADMIN']}>Test children</ProtectedRoute>
      </BrowserRouter>
    );

    // Then
    expect(window.location.pathname).toBe('/');
  });

  it('should render children when authorization complete', () => {
    // Given
    vi.spyOn(useMeDataModule, 'useMeData').mockReturnValue({
      me: {
        email: 'test@test.com',
        roles: [
          {
            id: 1,
            name: 'ADMIN',
          },
        ],
      },
      isLoading: false,
      isError: false,
    });

    // When
    renderWithProviders(
      <BrowserRouter>
        <ProtectedRoute roles={['ADMIN']}>Test children</ProtectedRoute>
      </BrowserRouter>
    );

    // Then
    expect(screen.getByText('Test children')).toBeInTheDocument();
  });

  it('should render children when authentication only complete', () => {
    // Given
    vi.spyOn(useMeDataModule, 'useMeData').mockReturnValue({
      me: {
        email: 'test@test.com',
        roles: [
          {
            id: 1,
            name: 'ADMIN',
          },
        ],
      },
      isLoading: false,
      isError: false,
    });

    // When
    renderWithProviders(
      <BrowserRouter>
        <ProtectedRoute>Test children</ProtectedRoute>
      </BrowserRouter>
    );

    // Then
    expect(screen.getByText('Test children')).toBeInTheDocument();
  });
});
