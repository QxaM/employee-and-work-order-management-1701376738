import Form from '../../../../src/components/shared/form/Form.tsx';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach } from 'vitest';
import { FormEvent } from 'react';

describe('Form', () => {
  const mockSubmit = vi
    .fn()
    .mockImplementation((event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('Should render children', () => {
    // Given
    const children = <div>Test</div>;
    render(<Form handleSubmit={mockSubmit}>{children}</Form>);

    // When
    const childrenElement = screen.getByText('Test');

    // Then
    expect(childrenElement).toBeInTheDocument();
  });

  it('Should call onSubmit when form is submitted', () => {
    // Given
    const submitText = 'Submit';

    render(
      <Form handleSubmit={mockSubmit}>
        <Form.Submit title={submitText} />
      </Form>
    );
    const submitButton = screen.getByRole('button', { name: submitText });

    // When
    fireEvent.click(submitButton);

    // Then
    expect(mockSubmit).toHaveBeenCalledTimes(1);
  });
});
