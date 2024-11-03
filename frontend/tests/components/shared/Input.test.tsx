import { describe, expect } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Input from '@/components/shared/Input.tsx';
import { ValidatorType } from '@/types/ValidatorTypes.ts';

describe('Input tests', () => {
  const TITLE = 'Test label';
  const PLACEHOLDER = 'Test placeholder';

  it('Should contain title and input and should be text', () => {
    // Given
    render(<Input title={TITLE} placeholder={PLACEHOLDER} />);

    // When
    const labelElement = screen.getByText(TITLE);
    const inputElement = screen.getByPlaceholderText(PLACEHOLDER);

    // Then
    expect(labelElement).toBeInTheDocument();
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('type', 'text');
  });

  it('Should allow to enter type', () => {
    // Given
    render(<Input title={TITLE} placeholder={PLACEHOLDER} type="password" />);

    // When
    const inputElement = screen.getByPlaceholderText(PLACEHOLDER);

    // Then
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('type', 'password');
  });

  it('Should allow to enter values', async () => {
    // Given
    const testInput = 'Test input';
    render(<Input title={TITLE} placeholder={PLACEHOLDER} />);
    const inputElement = screen.getByPlaceholderText(PLACEHOLDER);

    // When
    fireEvent.change(inputElement, { target: { value: testInput } });
    const newInputElement = await screen.findByDisplayValue(testInput);

    // Then
    expect(newInputElement).toBeInTheDocument();
  });

  it('Should not contain message when validation empty', () => {
    // Given
    render(<Input title={TITLE} placeholder={PLACEHOLDER} />);

    // When
    const errorElement = screen.queryByRole('paragraph');

    // Then
    expect(errorElement).not.toBeInTheDocument();
  });

  it('Should not contain message when validation is valid', () => {
    // Given
    const mockValidator = vi.fn().mockReturnValue({
      isValid: true,
      message: 'Test message',
    } as ValidatorType);
    render(
      <Input
        title={TITLE}
        placeholder={PLACEHOLDER}
        validator={mockValidator}
      />
    );
    const inputElement = screen.getByPlaceholderText(PLACEHOLDER);

    // When
    fireEvent.change(inputElement, { target: { value: 'Test' } });
    const errorElement = screen.queryByRole('paragraph');

    // Then
    expect(errorElement).not.toBeInTheDocument();
  });

  it('Should contain message when validation is invalid', async () => {
    // Given
    const mockValidator = vi.fn().mockReturnValue({
      isValid: false,
      message: 'Test message',
    } as ValidatorType);
    render(
      <Input
        title={TITLE}
        placeholder={PLACEHOLDER}
        validator={mockValidator}
      />
    );
    const inputElement = screen.getByPlaceholderText(PLACEHOLDER);

    // When
    fireEvent.change(inputElement, { target: { value: 'Test' } });
    const errorElement = await screen.findByText('Test message', {
      exact: false,
    });

    // Then
    expect(errorElement).toBeInTheDocument();
  });

  it('Should return value through ref', async () => {
    // Given
    const testInput = 'Test input';
    let refValue = '';

    const TestComponent = () => (
      <Input
        title={TITLE}
        placeholder={PLACEHOLDER}
        ref={(value) => {
          refValue = value ?? '';
        }}
      />
    );

    // When
    render(<TestComponent />);
    const inputElement = screen.getByPlaceholderText(PLACEHOLDER);
    fireEvent.change(inputElement, { target: { value: testInput } });

    // Then
    await waitFor(() => {
      expect(refValue).toBe(testInput);
    });
  });
});
