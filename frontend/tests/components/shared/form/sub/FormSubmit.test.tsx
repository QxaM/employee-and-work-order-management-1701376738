import FormSubmit from '../../../../../src/components/shared/form/sub/FormSubmit.tsx';
import { Form } from 'radix-ui';
import { render, screen } from '@testing-library/react';
import { EnvelopeClosedIcon } from '@radix-ui/react-icons';

describe('FormSubmit', () => {
  const title = 'Test button';

  it('Should render button', () => {
    // Given
    render(<FormSubmit title={title} />, { wrapper: Form.Root });

    // When
    const button = screen.getByRole('button', { name: title });

    // Then
    expect(button).toBeInTheDocument();
  });

  it('Should render spinner when pending', () => {
    // Given
    const spinnerTestId = 'spinner';
    render(<FormSubmit title={title} isServerPending={true} />, {
      wrapper: Form.Root,
    });

    // When
    const spinner = screen.getByTestId(spinnerTestId);

    // Then
    expect(spinner).toBeInTheDocument();
  });

  it('Should render icon when icon provided', () => {
    // Given
    const iconTestId = 'icon';
    const TestIcon = () => <EnvelopeClosedIcon data-testid={iconTestId} />;
    render(<FormSubmit title={title} icon={TestIcon} />, {
      wrapper: Form.Root,
    });

    // When
    const icon = screen.getByTestId(iconTestId);

    // Then
    expect(icon).toBeInTheDocument();
  });
});
