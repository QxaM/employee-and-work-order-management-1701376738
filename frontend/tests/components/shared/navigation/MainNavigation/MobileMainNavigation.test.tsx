import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import MobileMainNavigation from '@/components/shared/navigation/MainNavigation/MobileMainNavigation.tsx';

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
    render(<MobileMainNavigation />, { wrapper: BrowserRouter });

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
    render(<MobileMainNavigation />, {
      wrapper: BrowserRouter,
    });

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
    render(<MobileMainNavigation />, {
      wrapper: BrowserRouter,
    });
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

      render(<MobileMainNavigation />, {
        wrapper: BrowserRouter,
      });
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

      render(<MobileMainNavigation />, {
        wrapper: BrowserRouter,
      });
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

      render(<MobileMainNavigation />, {
        wrapper: BrowserRouter,
      });
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
  });
});
