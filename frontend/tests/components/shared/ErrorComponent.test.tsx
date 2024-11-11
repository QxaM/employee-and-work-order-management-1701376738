import { describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorComponent from '@/components/shared/ErrorComponent.tsx';

describe('Error Component', () => {
  it('Should render element correctly', () => {
    // Given
    const message = 'Test message';

    // When
    render(<ErrorComponent message={message} />);

    // Then
    const errorElement = screen.getByText(message);
    expect(errorElement).toBeInTheDocument();
  });
});
