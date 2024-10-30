import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import Footer from '../../../src/components/shared/Footer';

describe('Footer', () => {
  it('Should contain author', () => {
    // Given
    const authorName = 'Piotr Gliszczyński';

    // When
    render(<Footer />, { wrapper: BrowserRouter });
    const footerElement = screen.getByText(authorName, { exact: false });

    // Then
    expect(footerElement).toBeInTheDocument();
  });
});
