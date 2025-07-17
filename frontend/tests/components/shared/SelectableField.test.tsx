import { fireEvent, render, screen } from '@testing-library/react';

import SelectableField from '../../../src/components/shared/SelectableField.tsx';
import { afterEach } from 'vitest';

describe('SelectableField', () => {
  const value = 'test';

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('Should render value', () => {
    // Given
    render(
      <SelectableField value={value} isSelected={false} onClick={vi.fn()} />
    );

    // When
    const valueElement = screen.getByText(value);

    // Then
    expect(valueElement).toBeInTheDocument();
  });

  it('Should render correct styles when not selected', () => {
    // Given
    const styles = 'bg-qxam-neutral-light-lighter';

    render(
      <SelectableField value={value} isSelected={false} onClick={vi.fn()} />
    );

    // When
    const button = screen.getByRole('button');

    // Then
    expect(button).toHaveClass(styles);
  });

  it('Should render correct styles when selected', () => {
    // Given
    const styles = 'bg-qxam-secondary-lightest';

    render(
      <SelectableField value={value} isSelected={true} onClick={vi.fn()} />
    );

    // When
    const button = screen.getByRole('button');

    // Then
    expect(button).toHaveClass(styles);
  });

  it('Should handle onClick function', () => {
    // Given
    const mockOnClick = vi.fn();

    render(
      <SelectableField value={value} isSelected={true} onClick={mockOnClick} />
    );
    const button = screen.getByRole('button');

    // When
    fireEvent.click(button);

    // Then
    expect(mockOnClick).toHaveBeenCalledOnce();
  });

  it('Should pass injected styles', () => {
    // Given
    const styles = 'test-style';

    render(
      <SelectableField
        value={value}
        isSelected={false}
        onClick={vi.fn()}
        className={styles}
      />
    );

    // When
    const button = screen.getByRole('button');

    // Then
    expect(button).toHaveClass(styles);
  });
});
