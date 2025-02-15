import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { act, fireEvent, screen } from '@testing-library/react';

import MobileMainNavigation from '../../../../../src/components/shared/navigation/MainNavigation/MobileMainNavigation.tsx';
import { renderWithProviders } from '../../../../test-utils.tsx';
import { login } from '../../../../../src/store/authSlice.ts';

describe('Main Navigation Header', () => {
  beforeEach(() => {
    global.scrollTo = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('Should contain Logo component', () => {
    // Given
    const appName = 'MaxQ';
    renderWithProviders(
      <BrowserRouter>
        <MobileMainNavigation />
      </BrowserRouter>
    );

    // When
    const imageElement = screen.getByAltText(appName, { exact: false });
    const headerElement = screen.getByText(appName, { exact: false });

    // Then
    expect(imageElement).toBeInTheDocument();
    expect(headerElement).toBeInTheDocument();
  });

  it('Should contain hamburger menu button', () => {
    // Given
    const ariaLabel = 'Toggle navigation menu';
    renderWithProviders(
      <BrowserRouter>
        <MobileMainNavigation />
      </BrowserRouter>
    );

    // When
    const menuButton = screen.getByRole('button', {
      name: new RegExp(ariaLabel, 'i'),
    });

    // Then
    expect(menuButton).toBeInTheDocument();
  });

  it('Should open menu after clicking hamburger button', async () => {
    // Given
    const navHomeText = 'Home';
    const ariaLabel = 'Toggle navigation menu';
    renderWithProviders(
      <BrowserRouter>
        <MobileMainNavigation />
      </BrowserRouter>
    );
    const menuButton = screen.getByRole('button', {
      name: new RegExp(ariaLabel, 'i'),
    });

    // When
    fireEvent.click(menuButton);
    const homeLink = await screen.findByText(navHomeText, { exact: false });

    // Then
    expect(homeLink).toBeInTheDocument();
  });

  describe('Navigation', () => {
    it('Should navigate home, when "Home" is clicked', async () => {
      // Given
      const navHomeText = 'Home';
      const ariaLabel = 'Toggle navigation menu';

      renderWithProviders(
        <BrowserRouter>
          <MobileMainNavigation />
        </BrowserRouter>
      );
      const menuButton = screen.getByRole('button', {
        name: new RegExp(ariaLabel, 'i'),
      });

      fireEvent.click(menuButton);
      const homeLink = await screen.findByText(navHomeText, { exact: false });

      // When
      fireEvent.click(homeLink);

      // Then
      expect(window.location.pathname).toBe('/');
    });
  });

  describe('Login and Register', () => {
    it('Should contain Register Button', async () => {
      // Given
      const registerButtonText = 'Sign up';
      const ariaLabel = 'Toggle navigation menu';

      renderWithProviders(
        <BrowserRouter>
          <MobileMainNavigation />
        </BrowserRouter>
      );
      const menuButton = screen.getByRole('button', {
        name: new RegExp(ariaLabel, 'i'),
      });

      fireEvent.click(menuButton);

      // When
      const registerButton = await screen.findByRole('link', {
        name: registerButtonText,
      });

      // Then
      expect(registerButton).toBeInTheDocument();
    });

    it('Should navigate to register page', async () => {
      // Given
      const registerButtonText = 'Sign up';
      const ariaLabel = 'Toggle navigation menu';

      renderWithProviders(
        <BrowserRouter>
          <MobileMainNavigation />
        </BrowserRouter>
      );
      const menuButton = screen.getByRole('button', {
        name: new RegExp(ariaLabel, 'i'),
      });
      fireEvent.click(menuButton);

      const registerButton = await screen.findByRole('link', {
        name: registerButtonText,
      });

      // When
      fireEvent.click(registerButton);

      // Then
      expect(window.location.pathname).toBe('/register');
    });

    it('Should contain Login Button', async () => {
      // Given
      const loginButtonText = 'Login';
      const ariaLabel = 'Toggle navigation menu';

      renderWithProviders(
        <BrowserRouter>
          <MobileMainNavigation />
        </BrowserRouter>
      );
      const menuButton = screen.getByRole('button', {
        name: new RegExp(ariaLabel, 'i'),
      });

      fireEvent.click(menuButton);

      // When
      const loginButton = await screen.findByRole('link', {
        name: loginButtonText,
      });

      // Then
      expect(loginButton).toBeInTheDocument();
    });

    it('Should navigate to login page', async () => {
      // Given
      const loginButtonText = 'Login';
      const ariaLabel = 'Toggle navigation menu';

      renderWithProviders(
        <BrowserRouter>
          <MobileMainNavigation />
        </BrowserRouter>
      );
      const menuButton = screen.getByRole('button', {
        name: new RegExp(ariaLabel, 'i'),
      });
      fireEvent.click(menuButton);

      const loginButton = await screen.findByRole('link', {
        name: loginButtonText,
      });

      // When
      fireEvent.click(loginButton);

      // Then
      expect(window.location.pathname).toBe('/login');
    });

    it('Should contain welcome message when logged in', () => {
      // Given
      const { store } = renderWithProviders(
        <BrowserRouter>
          <MobileMainNavigation />
        </BrowserRouter>
      );

      const ariaLabel = 'Toggle navigation menu';
      const menuButton = screen.getByRole('button', {
        name: new RegExp(ariaLabel, 'i'),
      });
      fireEvent.click(menuButton);

      // When
      act(() => {
        store.dispatch(login({ token: '12345' }));
      });

      const loginButtonText = 'Login';
      const loginButton = screen.queryByRole('link', {
        name: loginButtonText,
      });

      // Then
      expect(loginButton).not.toBeInTheDocument();
      expect(screen.getByText('Welcome back!')).toBeInTheDocument();
    });
  });
});
