import { fireEvent, render, screen } from '@testing-library/react';
import FormInput from '../../../../../src/components/shared/form/sub/FormInput.tsx';
import { Form } from 'radix-ui';
import { EnvelopeClosedIcon } from '@radix-ui/react-icons';
import { afterEach, beforeEach } from 'vitest';

describe('FormInput', () => {
  const label = 'Test label';

  it('Should render label', () => {
    // Given

    // When
    render(<FormInput name={label} />, { wrapper: Form.Root });
    const labelElement = screen.getByText(label);

    // Then
    expect(labelElement).toBeInTheDocument();
  });

  describe('Render input elements', () => {
    it('Should render input icon', () => {
      // Given
      const iconTestId = 'icon';
      const TestIcon = () => <EnvelopeClosedIcon data-testid={iconTestId} />;

      // When
      render(<FormInput name={label} icon={TestIcon} />, {
        wrapper: Form.Root,
      });
      const iconElement = screen.getByTestId(iconTestId);

      // Then
      expect(iconElement).toBeInTheDocument();
    });

    it('Should render eye for password', () => {
      // Given

      // When
      render(<FormInput name={label} type="password" />, {
        wrapper: Form.Root,
      });
      const iconElement = screen.getByRole('button');

      // Then
      expect(iconElement).toBeInTheDocument();
    });

    it('Should not render eye for not password', () => {
      // Given

      // When
      render(<FormInput name={label} type="text" />, {
        wrapper: Form.Root,
      });
      const iconElement = screen.queryByRole('button');

      // Then
      expect(iconElement).not.toBeInTheDocument();
    });

    it('Should change type when eyeIcon is clicked', () => {
      // Given
      render(<FormInput name={label} type="password" />, {
        wrapper: Form.Root,
      });
      const iconElement = screen.getByRole('button');

      // When
      fireEvent.click(iconElement);
      const textInput = screen.getByRole('textbox');

      // Then
      expect(textInput).toHaveAttribute('type', 'text');
    });

    it('Should change type back to password, when eyeIcon is clicked again', () => {
      // Given
      render(<FormInput name={label} type="password" />, {
        wrapper: Form.Root,
      });
      const iconElement = screen.getByRole('button');
      fireEvent.click(iconElement);

      // When
      const iconElement2 = screen.getByRole('button');
      fireEvent.click(iconElement2);
      const textInput = screen.getByLabelText(label);

      // Then
      expect(textInput).toHaveAttribute('type', 'password');
    });

    it('Should render error element', () => {
      // Given
      const errorMessage = `${label} is required`;

      render(<FormInput name={label} type="text" required />, {
        wrapper: Form.Root,
      });
      const inputElement = screen.getByRole('textbox');

      // When
      fireEvent.change(inputElement, { target: { value: '' } });
      fireEvent.blur(inputElement);
      const errorElement = screen.getByText(errorMessage);

      // Then
      expect(errorElement).toBeInTheDocument();
    });
  });

  describe('Function handlers', () => {
    const mock = vi.fn();

    beforeEach(() => {
      vi.clearAllMocks();
    });

    afterEach(() => {
      vi.resetAllMocks();
    });

    it('Should call provided onChange function', () => {
      // Given
      render(<FormInput name={label} type="text" onChange={mock} required />, {
        wrapper: Form.Root,
      });
      const inputElement = screen.getByRole('textbox');

      // When
      fireEvent.change(inputElement, { target: { value: 'test' } });

      // Then
      expect(mock).toHaveBeenCalledTimes(1);
    });

    it('Should call provided onInput function', () => {
      // Given
      render(<FormInput name={label} type="text" onInput={mock} required />, {
        wrapper: Form.Root,
      });
      const inputElement = screen.getByRole('textbox');

      // When
      fireEvent.input(inputElement, { target: { value: 'test' } });

      // Then
      expect(mock).toHaveBeenCalledTimes(1);
    });
  });
});
