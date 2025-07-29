import { afterEach, describe, expect, it } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { act, fireEvent, screen } from '@testing-library/react';

import MainNavigationHeader from '../../../../../src/components/shared/navigation/MainNavigation/MainNavigationHeader.tsx';
import { renderWithProviders } from '../../../../test-utils.tsx';
import { login } from '../../../../../src/store/authSlice.ts';
import * as useMeDataModule from '../../../../../src/hooks/useMeData.tsx';
import { MeType } from '../../../../../src/store/api/auth.ts';

describe('Main Navigation Header', () => {
  it('Should contain Logo component', () => {
    // Given
    const appName = 'MaxQ';
    renderWithProviders(
      <BrowserRouter>
        <MainNavigationHeader />
      </BrowserRouter>
    );

    // When
    const imageElement = screen.getByAltText(appName, { exact: false });
    const headerElement = screen.getByText(appName, { exact: false });

    // Then
    expect(imageElement).toBeInTheDocument();
    expect(headerElement).toBeInTheDocument();
  });

  describe('Navigation', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('Should contain navigation links', () => {
      // Given
      const navHomeText = 'Home';
      renderWithProviders(
        <BrowserRouter>
          <MainNavigationHeader />
        </BrowserRouter>
      );

      // When
      const homeLink = screen.getByText(navHomeText, { exact: false });

      // Then
      expect(homeLink).toBeInTheDocument();
    });

    it('Should navigate home, when "Home" is clicked', () => {
      // Given
      const navHomeText = 'Home';
      renderWithProviders(
        <BrowserRouter>
          <MainNavigationHeader />
        </BrowserRouter>
      );
      const homeLink = screen.getByText(navHomeText, { exact: false });

      // When
      fireEvent.click(homeLink);

      // Then
      expect(window.location.pathname).toBe('/');
    });

    it('Should contain Admin navigation link, when is logged as admin', () => {
      // Given
      const navAdminText = 'Admin';
      const me: MeType = {
        email: 'test@test.com',
        roles: [
          {
            id: 1,
            name: 'ADMIN',
          },
        ],
      };
      vi.spyOn(useMeDataModule, 'useMeData').mockReturnValue({
        me,
        isLoading: false,
        isError: false,
      });

      renderWithProviders(
        <BrowserRouter>
          <MainNavigationHeader />
        </BrowserRouter>
      );

      // When
      const adminLink = screen.getByText(navAdminText, { exact: false });

      // Then
      expect(adminLink).toBeInTheDocument();
    });

    it('Should navigate to Admin when admin link is clicked', () => {
      // Given
      const navAdminText = 'Admin';
      const me: MeType = {
        email: 'test@test.com',
        roles: [
          {
            id: 1,
            name: 'ADMIN',
          },
        ],
      };
      vi.spyOn(useMeDataModule, 'useMeData').mockReturnValue({
        me,
        isLoading: false,
        isError: false,
      });

      renderWithProviders(
        <BrowserRouter>
          <MainNavigationHeader />
        </BrowserRouter>
      );
      const adminLink = screen.getByText(navAdminText, { exact: false });

      // When
      fireEvent.click(adminLink);

      // Then
      expect(window.location.pathname).toBe('/admin');
    });
  });

  describe('Login, Register, Logout', () => {
    it('Should contain Register Button', () => {
      // Given
      const registerButtonText = 'Sign up';

      // When
      renderWithProviders(
        <BrowserRouter>
          <MainNavigationHeader />
        </BrowserRouter>
      );
      const registerButton = screen.getByRole('link', {
        name: registerButtonText,
      });

      // Then
      expect(registerButton).toBeInTheDocument();
    });

    it('Should navigate to register page', () => {
      // Given
      const registerButtonText = 'Sign up';
      renderWithProviders(
        <BrowserRouter>
          <MainNavigationHeader />
        </BrowserRouter>
      );
      const registerButton = screen.getByRole('link', {
        name: registerButtonText,
      });

      // When
      fireEvent.click(registerButton);

      // Then
      expect(window.location.pathname).toBe('/register');
    });

    it('Should contain Login Button', () => {
      // Given
      const loginButtonText = 'Login';

      // When
      renderWithProviders(
        <BrowserRouter>
          <MainNavigationHeader />
        </BrowserRouter>
      );
      const loginButton = screen.getByRole('link', {
        name: loginButtonText,
      });

      // Then
      expect(loginButton).toBeInTheDocument();
    });

    it('Should navigate to login page', () => {
      // Given
      const loginButtonText = 'Login';
      renderWithProviders(
        <BrowserRouter>
          <MainNavigationHeader />
        </BrowserRouter>
      );
      const loginButton = screen.getByRole('link', {
        name: loginButtonText,
      });

      // When
      fireEvent.click(loginButton);

      // Then
      expect(window.location.pathname).toBe('/login');
    });

    it('Should contain welcome message and logout button when logged in', async () => {
      // Given
      const loginButtonText = 'Login';
      const logoutButtonText = 'Logout';

      const { store } = renderWithProviders(
        <BrowserRouter>
          <MainNavigationHeader />
        </BrowserRouter>
      );

      // When
      act(() => {
        store.dispatch(login({ token: '12345' }));
      });

      const loginButton = screen.queryByRole('link', {
        name: loginButtonText,
      });
      const logoutButton = await screen.findByText(logoutButtonText);

      // Then
      expect(loginButton).not.toBeInTheDocument();
      expect(screen.getByText('Welcome back!')).toBeInTheDocument();
      expect(logoutButton).toBeInTheDocument();
    });

    it('Should logout and clear store', async () => {
      // Given
      const logoutButtonText = 'Logout';
      const { store } = renderWithProviders(
        <BrowserRouter>
          <MainNavigationHeader />
        </BrowserRouter>
      );
      act(() => {
        store.dispatch(login({ token: '12345' }));
      });

      const logoutButton = await screen.findByText(logoutButtonText);

      // When
      fireEvent.click(logoutButton);

      // Then
      expect(store.getState().auth.token).toBeUndefined();
    });
  });
});
