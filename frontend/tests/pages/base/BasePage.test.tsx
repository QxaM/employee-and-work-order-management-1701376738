import { render, screen } from '@testing-library/react';
import BasePage from '../../../src/pages/base/BasePage.tsx';

describe('BasePage', () => {
  it('Should render children', () => {
    // Given
    const children = <div>Test</div>;

    // When
    render(<BasePage>{children}</BasePage>);
    const childrenElement = screen.getByText('Test');

    // Then
    expect(childrenElement).toBeInTheDocument();
  });
});
