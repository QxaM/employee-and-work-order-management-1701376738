import { render, screen } from '@testing-library/react';

import DisplayField from '../../../src/components/shared/DisplayField.tsx';

describe('DisplayField', () => {
  const testId = 'display-field';
  const title = 'Test title';
  const value = 'Test value';

  it('Should render a field with a label', () => {
    // Given
    render(<DisplayField title={title} value={value} />);

    // When
    const titleElement = screen.getByText(`${title}:`);
    const valueElement = screen.getByText(value);

    // Then
    expect(titleElement).toBeInTheDocument();
    expect(valueElement).toBeInTheDocument();
  });

  it('Should render vertical orientation', () => {
    // Given
    const verticalClass = 'grid-row-2';
    render(<DisplayField title={title} value={value} orientation="vertical" />);

    // When
    const displayField = screen.getByTestId(testId);

    // Then
    expect(displayField).toHaveClass(verticalClass);
  });

  it('Should render horizontal orientation', () => {
    // Given
    const horizontalClass = 'grid-cols-2';
    render(
      <DisplayField title={title} value={value} orientation="horizontal" />
    );

    // When
    const displayField = screen.getByTestId(testId);

    // Then
    expect(displayField).toHaveClass(horizontalClass);
  });

  it('Should pass class names', () => {
    // Given
    const testClass = 'test-class';
    render(<DisplayField title={title} value={value} className={testClass} />);

    // When
    const displayField = screen.getByTestId(testId);

    // Then
    expect(displayField).toHaveClass(testClass);
  });
});
