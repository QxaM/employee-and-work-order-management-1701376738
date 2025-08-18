import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import Logo from '../../../src/components/shared/Logo';

describe('Logo Tests', () => {
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
