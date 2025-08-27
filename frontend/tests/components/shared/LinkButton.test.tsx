import { fireEvent, render, screen } from '@testing-library/react';
import LinkButton from '../../../src/components/shared/LinkButton.tsx';
import { BrowserRouter } from 'react-router-dom';

describe('LinkButton', () => {
  it('Should render children', () => {
    // Given
    const children = <div>Test</div>;

    // When
    render(<LinkButton to="/test">{children}</LinkButton>, {
      wrapper: BrowserRouter,
    });
    const childrenElement = screen.getByText('Test');

    // Then
    expect(childrenElement).toBeInTheDocument();
  });

  it('Should navigate to the correct path', () => {
    // Given
    const to = '/test';
    render(<LinkButton to={to} />, {
      wrapper: BrowserRouter,
    });

    // When
    const link = screen.getByRole('link');
    fireEvent.click(link);

    // Then
    expect(window.location.pathname).toContain(to);
  });
});
