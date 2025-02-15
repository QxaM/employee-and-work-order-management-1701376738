import { describe } from 'vitest';
import { render, screen } from '@testing-library/react';

import LoadingSpinner from '../../../src/components/shared/LoadingSpinner.tsx';

describe('LoadingSpinner', () => {
  it('Should render default spinner', () => {
    // Given

    // When
    render(<LoadingSpinner />);

    // Then
    const spinnerDiv = screen.getByTestId('spinner');
    expect(spinnerDiv).toBeInTheDocument();
    expect(spinnerDiv).toHaveClass(
      'border-qxam-primary-lightest border-t-qxam-primary',
      { exact: false }
    );
    expect(spinnerDiv).toHaveClass('w-12 h-12 border-[6px]', { exact: false });
  });

  it('Should render custom spinner', () => {
    // Given
    const size = 'small';
    const color = 'secondary';

    // When
    render(<LoadingSpinner size={size} color={color} />);

    // Then
    const spinnerDiv = screen.getByTestId('spinner');
    expect(spinnerDiv).toBeInTheDocument();
    expect(spinnerDiv).toHaveClass(
      'border-qxam-secondary-lightest border-t-qxam-secondary',
      { exact: false }
    );
    expect(spinnerDiv).toHaveClass('w-8 h-8 border-[5px]', { exact: false });
  });
});
