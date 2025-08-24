import FormContent from '../../../../../src/components/shared/form/sub/FormContent.tsx';
import { render, screen } from '@testing-library/react';
import { QueryError } from '../../../../../src/types/ApiTypes.ts';

describe('FormContent', () => {
  it('Should render children', () => {
    // Given
    const children = <div>Test</div>;

    // When
    render(<FormContent>{children}</FormContent>);
    const childrenComponent = screen.getByText('Test');

    // Then
    expect(childrenComponent).toBeInTheDocument();
  });

  it('Should render string error', () => {
    // Given
    const isError = true;
    const error = 'Test error';

    // When
    render(<FormContent isServerError={isError} serverError={error} />);
    const errorComponent = screen.getByText(error);

    // Then
    expect(errorComponent).toBeInTheDocument();
  });

  it('Should render Error', () => {
    // Given
    const isError = true;
    const error = new Error('Test error');

    // When
    render(<FormContent isServerError={isError} serverError={error} />);
    const errorComponent = screen.getByText(error.message);

    // Then
    expect(errorComponent).toBeInTheDocument();
  });

  it('Should render QueryError', () => {
    // Given
    const isError = true;
    const error = {
      message: 'Test error',
      status: 400,
    };

    // When
    render(
      <FormContent isServerError={isError} serverError={error as QueryError} />
    );
    const errorComponent = screen.getByText(error.message);

    // Then
    expect(errorComponent).toBeInTheDocument();
  });
});
