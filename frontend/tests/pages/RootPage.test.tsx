import { afterEach, beforeEach, describe, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import RootPage from '@/pages/RootPage.tsx';
import { Size } from '@/types/WindowTypes.ts';

const mockWindowSize = vi.fn(() => ({}) as Size);
vi.mock('@/hooks/useWindowSize.tsx', () => ({
  default: (): Size => mockWindowSize(),
}));

describe('Root Page', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    mockWindowSize.mockReset();
  });

  it('Should contain Footer', () => {
    // Given
    const authorName = 'Piotr Gliszczyński';
    mockWindowSize.mockReturnValue({ width: 1024, height: 768 });

    // When
    render(<RootPage />, { wrapper: BrowserRouter });
    const footerElement = screen.getByText(authorName, { exact: false });

    // Then
    expect(footerElement).toBeInTheDocument();
  });

  it('Should contain standard navigation header', () => {
    // Given
    const ariaLabel = 'Toggle navigation menu';
    mockWindowSize.mockReturnValue({ width: 1024, height: 768 });

    // When
    render(<RootPage />, { wrapper: BrowserRouter });
    const menuButton = screen.queryByRole('button', {
      name: new RegExp(ariaLabel, 'i'),
    });

    // Then
    expect(menuButton).not.toBeInTheDocument();
  });

  it('Should contain mobile navigation header', () => {
    // Given
    const ariaLabel = 'Toggle navigation menu';
    mockWindowSize.mockReturnValue({ width: 500, height: 768 });

    // When
    render(<RootPage />, { wrapper: BrowserRouter });
    const menuButton = screen.queryByRole('button', {
      name: new RegExp(ariaLabel, 'i'),
    });

    // Then
    expect(menuButton).toBeInTheDocument();
  });
});
