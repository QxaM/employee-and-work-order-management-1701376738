import { render, screen } from '@testing-library/react';
import IconWithBackground from '../../../../src/components/icons/base/IconWithBackground.tsx';

const testId = 'test-icon';
const TestIcon = () => <div data-testid={testId}>A</div>;

describe('IconWithBackground', () => {
  it('Should contain parent wrapper', () => {
    // Given
    render(<IconWithBackground icon={TestIcon} />);

    // When
    const parentWrapper = screen.getByTestId(testId).parentElement;

    // Then
    expect(parentWrapper).toBeInTheDocument();
  });

  it('Should assign background color', () => {
    // Given
    const violetClasses = 'bg-(--violet-a3)';
    render(<IconWithBackground icon={TestIcon} />);

    // When
    const parentWrapper = screen.getByTestId(testId).parentElement;

    // Then
    expect(parentWrapper).toHaveClass(violetClasses);
  });
});
