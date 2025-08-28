import { render, screen } from '@testing-library/react';
import DemoCallout from '../../src/components/DemoCallout.tsx';
import { expect } from 'vitest';

describe('DemoCallout', () => {
  it('Should contain demo information', () => {
    // Given
    const demoMessage = 'Demo Environment Notice.';

    // When
    render(<DemoCallout />);
    const demoElement = screen.getByText(demoMessage, { exact: false });

    // Then
    expect(demoElement).toBeInTheDocument();
  });
});
