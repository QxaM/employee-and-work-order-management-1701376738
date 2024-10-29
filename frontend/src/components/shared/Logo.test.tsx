import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import Logo from './Logo.tsx';

describe('Logo Tests', () => {
  it('Should contain image element', () => {
    // Given
    const imgAltText = 'Logo';

    // When
    render(<Logo />, { wrapper: BrowserRouter });
    const imageElement = screen.getByAltText(imgAltText, { exact: false });

    // Then
    expect(imageElement).toBeInTheDocument();
  });

  it('Should contain title element', () => {
    // Given
    const title = 'MaxQ Work Manager';

    // When
    render(<Logo />, { wrapper: BrowserRouter });
    const titleHeading = screen.getByText(title, { exact: false });

    // Then
    expect(titleHeading).toBeInTheDocument();
  });
});
