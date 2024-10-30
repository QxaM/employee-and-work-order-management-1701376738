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
