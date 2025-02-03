import { describe, expect, it } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import MainNavigationHeader from '@/components/shared/navigation/MainNavigation/MainNavigationHeader.tsx';

describe('Main Navigation Header', () => {
  it('Should contain Logo component', () => {
    // Given
    const appName = 'MaxQ';
    render(<MainNavigationHeader />, { wrapper: BrowserRouter });

    // When
    const imageElement = screen.getByAltText(appName, { exact: false });
    const headerElement = screen.getByText(appName, { exact: false });

    // Then
    expect(imageElement).toBeInTheDocument();
    expect(headerElement).toBeInTheDocument();
  });

  describe('Navigation', () => {
    it('Should contain navigation links', () => {
      // Given
      const navHomeText = 'Home';
      render(<MainNavigationHeader />, { wrapper: BrowserRouter });

      // When
      const homeLink = screen.getByText(navHomeText, { exact: false });

      // Then
      expect(homeLink).toBeInTheDocument();
    });

    it('Should navigate home, when "Home" is clicked', () => {
      // Given
      const navHomeText = 'Home';
      render(<MainNavigationHeader />, { wrapper: BrowserRouter });
      const homeLink = screen.getByText(navHomeText, { exact: false });

      // When
      fireEvent.click(homeLink);

      // Then
      expect(window.location.pathname).toBe('/');
    });
  });

  describe('Login and Register', () => {
    it('Should contain Register Button', () => {
      // Given
      const registerButtonText = 'Sign up';

      // When
      render(<MainNavigationHeader />, { wrapper: BrowserRouter });
      const registerButton = screen.getByRole('link', {
        name: registerButtonText,
      });

      // Then
      expect(registerButton).toBeInTheDocument();
    });

    it('Should navigate to register page', () => {
      // Given
      const registerButtonText = 'Sign up';
      render(<MainNavigationHeader />, { wrapper: BrowserRouter });
      const registerButton = screen.getByRole('link', {
        name: registerButtonText,
      });

      // When
      fireEvent.click(registerButton);

      // Then
      expect(window.location.pathname).toBe('/register');
    });
  });
});
