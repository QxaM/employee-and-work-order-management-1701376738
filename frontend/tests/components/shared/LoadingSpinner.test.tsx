import { describe } from 'vitest';
import { render, screen } from '@testing-library/react';

import LoadingSpinner from '../../../src/components/shared/LoadingSpinner.tsx';

describe('LoadingSpinner', () => {
  it('Should render default spinner', () => {
    // Given

    // When
    render(<LoadingSpinner isLoading />);

    // Then
    const spinnerDiv = screen.getByTestId('spinner');
    expect(spinnerDiv).toBeInTheDocument();
    expect(spinnerDiv).toHaveClass('border-violet-3 border-t-violet-9', {
      exact: false,
    });
    expect(spinnerDiv).toHaveClass('w-12 h-12 border-[6px]', { exact: false });
  });

  it('Should render custom spinner', () => {
    // Given
    const size = 'small';
    const color = 'secondary';

    // When
    render(<LoadingSpinner size={size} color={color} isLoading />);

    // Then
    const spinnerDiv = screen.getByTestId('spinner');
    expect(spinnerDiv).toBeInTheDocument();
    expect(spinnerDiv).toHaveClass(
      'border-qxam-secondary-lightest border-t-qxam-secondary',
      { exact: false }
    );
    expect(spinnerDiv).toHaveClass('w-8 h-8 border-[5px]', { exact: false });
  });

  it('Should not render if not loading', () => {
    // Given

    // When
    render(<LoadingSpinner isLoading={false} />);
    const spinnerDiv = screen.queryByTestId('spinner');

    // Then
    expect(spinnerDiv).not.toBeInTheDocument();
  });

  it('Should render children if not loading', () => {
    // Given
    const text = 'Test text';

    // When
    render(<LoadingSpinner isLoading={false}>{text}</LoadingSpinner>);
    const childComponent = screen.getByText(text);

    // Then
    expect(childComponent).toBeInTheDocument();
  });

  it('Should not render children if not loading', () => {
    // Given
    const text = 'Test text';

    // When
    render(<LoadingSpinner isLoading={true}>{text}</LoadingSpinner>);
    const childComponent = screen.queryByText(text);

    // Then
    expect(childComponent).not.toBeInTheDocument();
  });
});
