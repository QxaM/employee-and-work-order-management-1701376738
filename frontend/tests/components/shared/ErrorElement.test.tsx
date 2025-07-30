import { afterEach, beforeEach } from 'vitest';
import {
  createMemoryRouter,
  ErrorResponse,
  RouterProvider,
  useRouteError,
} from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import ErrorElement from '../../../src/components/shared/ErrorElement.tsx';
import { CustomFetchBaseQueryError } from '../../../src/store/api/base.ts';
import { SerializedError } from '@reduxjs/toolkit';
import RolesUpdate from '../../../src/components/admin/roles-update/RolesUpdate.tsx';
import { renderWithProviders } from '../../test-utils.tsx';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useRouteError: vi.fn(),
  };
});

describe('Error Element', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Standalone', () => {
    it('should render title and general message', () => {
      // Given
      const title = 'Something went wrong!';
      const message =
        'Something went wrong during your request. See details below or try again' +
        ' later.';

      render(<ErrorElement />);

      // when
      const titleElement = screen.getByText(title);
      const messageElement = screen.getByText(message);

      // Then
      expect(titleElement).toBeInTheDocument();
      expect(messageElement).toBeInTheDocument();
    });

    it('should render error Response', () => {
      // Given
      vi.mocked(useRouteError).mockReturnValue({
        status: 500,
        statusText: 'Test error',
        internal: false,
        data: 'Test data',
      } as ErrorResponse);

      // When
      render(<ErrorElement />);
      const errorStatus = screen.getByText('Error 500');
      const errorDescription = screen.getByText('Test error');

      // Then
      expect(errorStatus).toBeInTheDocument();
      expect(errorDescription).toBeInTheDocument();
    });

    it('should render error as Error', () => {
      // Given
      vi.mocked(useRouteError).mockReturnValue(new Error('Test error'));

      render(<ErrorElement />);

      // When
      const errorStatus = screen.getByText('Error Unknown');
      const errorDescription = screen.getByText('Test error');

      // Then
      expect(errorStatus).toBeInTheDocument();
      expect(errorDescription).toBeInTheDocument();
    });

    it('should render error as TypeError', () => {
      // Given
      vi.mocked(useRouteError).mockReturnValue(new TypeError('Test error'));

      render(<ErrorElement />);

      // When
      const errorStatus = screen.getByText('Error TypeError');
      const errorDescription = screen.getByText('Test error');

      // Then
      expect(errorStatus).toBeInTheDocument();
      expect(errorDescription).toBeInTheDocument();
    });

    it('should render error as CustomFetchBaseQueryError', () => {
      // Given
      const error: CustomFetchBaseQueryError = {
        status: 500,
        message: 'Test error',
      };
      vi.mocked(useRouteError).mockReturnValue(error);

      render(<ErrorElement />);

      // When
      const errorStatus = screen.getByText('Error 500');
      const errorDescription = screen.getByText('Test error');

      // Then
      expect(errorStatus).toBeInTheDocument();
      expect(errorDescription).toBeInTheDocument();
    });

    it('should render error as SerializedError', () => {
      // Given
      const error: SerializedError = {
        code: 'TEST_ERROR',
        message: 'Test error',
      };
      vi.mocked(useRouteError).mockReturnValue(error);

      render(<ErrorElement />);

      // When
      const errorStatus = screen.getByText('Error TEST_ERROR');
      const errorDescription = screen.getByText('Test error');

      // Then
      expect(errorStatus).toBeInTheDocument();
      expect(errorDescription).toBeInTheDocument();
    });
  });

  describe('Rendered from route', () => {
    it('should render ErrorElement when loader throws', async () => {
      // Given
      const error: CustomFetchBaseQueryError = {
        status: 403,
        message: 'Forbidden',
      };
      const mockLoader = vi.fn().mockRejectedValue(error);
      vi.mocked(useRouteError).mockReturnValue(error);
      const router = createMemoryRouter(
        [
          {
            path: '/admin/roles-update',
            element: <RolesUpdate />,
            errorElement: <ErrorElement />,
            loader: mockLoader,
          },
        ],
        {
          initialEntries: ['/admin/roles-update'],
        }
      );

      renderWithProviders(<RouterProvider router={router} />);

      // When
      const errorStatus = await screen.findByText('Error 403');
      const errorMessage = await screen.findByText('Forbidden');

      // Then
      expect(errorStatus).toBeInTheDocument();
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
