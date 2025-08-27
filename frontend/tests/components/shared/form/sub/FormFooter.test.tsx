import { render, screen } from '@testing-library/react';
import FormFooter from '../../../../../src/components/shared/form/sub/FormFooter.tsx';

describe('FormFooter', () => {
  it('Should render children', () => {
    // Given
    const children = <div>Test</div>;

    // When
    render(<FormFooter>{children}</FormFooter>);
    const childrenComponent = screen.getByText('Test');

    // Then
    expect(childrenComponent).toBeInTheDocument();
  });

  it('Should render separator', () => {
    // Given
    const separatorTestId = 'separator';

    // When
    render(<FormFooter />);
    const separator = screen.getByTestId(separatorTestId);

    // Then
    expect(separator).toBeInTheDocument();
  });
});
