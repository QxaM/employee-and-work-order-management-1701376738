import FormInputMessage from '../../../../../src/components/shared/form/sub/FormInputMessage.tsx';
import { Form } from 'radix-ui';
import { render, screen } from '@testing-library/react';
import { PropsWithChildren } from 'react';

const TestWrapper = ({ children }: PropsWithChildren) => {
  return (
    <Form.Root>
      <Form.Field>{children}</Form.Field>
    </Form.Root>
  );
};

describe('FormInputMessage', () => {
  it('Should render error element', () => {
    // Given
    const errorMessage = 'Test error message';

    // When
    render(<FormInputMessage title={errorMessage} forceMatch />, {
      wrapper: TestWrapper,
    });
    const errorElement = screen.getByText(errorMessage);

    // Then
    expect(errorElement).toBeInTheDocument();
  });
});
