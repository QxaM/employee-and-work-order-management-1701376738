import FormSelect from '../../../../../src/components/shared/form/sub/FormSelect.tsx';
import {fireEvent, screen} from '@testing-library/react';
import {Form} from 'radix-ui';
import {renderWithProviders} from '../../../../test-utils.tsx';
import {describe} from 'vitest';

describe('FormSelect', () => {
  const label = 'Test label';
  const options = [
    {
      label: 'label 1',
      value: 'value 1',
    },
    {
      label: 'label 2',
      value: 'value 2',
    },
  ];

  it('should render label', () => {
    // Given

    // When
    renderWithProviders(<FormSelect name={label} options={options} />, {
      wrapper: Form.Root,
    });
    const labelElement = screen.getByText(label);
    const selectElement = screen.getByRole('combobox');

    // Then
    expect(labelElement).toBeInTheDocument();
    expect(selectElement).toBeInTheDocument();
  });

  it('should not render label and name as id', () => {
    // Given

    // When
    renderWithProviders(<FormSelect id={label} options={options} />, {
      wrapper: Form.Root,
    });
    const labelElement = screen.queryByRole(label);
    const selectElement = screen.getByRole('combobox');

    // Then
    expect(labelElement).not.toBeInTheDocument();
    expect(selectElement).toBeInTheDocument();
  });

  it('should not render label and default name', () => {
    // Given
    const defaultField = 'field';

    // When
    renderWithProviders(<FormSelect options={options} />, {
      wrapper: Form.Root,
    });
    const labelElement = screen.queryByRole(defaultField);
    const selectElement = screen.getByRole('combobox');

    // Then
    expect(labelElement).not.toBeInTheDocument();
    expect(selectElement).toBeInTheDocument();
  });

  it('should render select options', () => {
    // Given
    renderWithProviders(<FormSelect name={label} options={options} />, {
      wrapper: Form.Root,
    });
    const selectElement = screen.getByRole('combobox');

    // When
    fireEvent.click(selectElement);
    const option1 = screen.getByRole('option', { name: options[0].label });
    const option2 = screen.getByRole('option', { name: options[1].label });

    // Then
    expect(option1).toBeInTheDocument();
    expect(option2).toBeInTheDocument();
  });

  describe('Error element', () => {
    const TestForm = (
      <Form.Root
        onSubmit={(event) => {
          event.preventDefault();
          console.log('Submit select');
        }}
      >
        <FormSelect name={label} options={options} required />
        <Form.Submit asChild>
          <button>Submit</button>
        </Form.Submit>
      </Form.Root>
    );

    it('should render error element', () => {
      // Given
      const errorMessage = `${label} is required`;

      renderWithProviders(TestForm);
      const submitButton = screen.getByRole('button', { name: 'Submit' });

      // When
      fireEvent.click(submitButton);
      const errorElement = screen.getByText(errorMessage);

      // Then
      expect(errorElement).toBeInTheDocument();
    });

    it('should clear render when option is selected', () => {
      // Given
      const errorMessage = `${label} is required`;

      renderWithProviders(TestForm);
      const submitButton = screen.getByRole('button', { name: 'Submit' });

      // When
      fireEvent.click(submitButton);

      const selectElement = screen.getByRole('combobox');
      fireEvent.click(selectElement);

      const option1 = screen.getByRole('option', { name: options[0].label });
      fireEvent.click(option1);
      fireEvent.click(submitButton);

      const errorElement = screen.queryByText(errorMessage);

      // Then
      expect(errorElement).not.toBeInTheDocument();
    });
  });
});
