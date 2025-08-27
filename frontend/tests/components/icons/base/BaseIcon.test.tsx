import { IconProps } from '../../../../src/types/components/BaseTypes.ts';
import BaseIcon from '../../../../src/components/icons/base/BaseIcon.tsx';
import { render, screen } from '@testing-library/react';

const testId = 'test-icon';

const TestIcon = ({ className }: IconProps) => {
  return <div className={className} data-testid="test-icon"></div>;
};

describe('BaseIcon', () => {
  it('Should render children', () => {
    // Given

    // When
    render(
      <BaseIcon>
        <TestIcon />
      </BaseIcon>
    );
    const childElement = screen.getByTestId(testId);

    // Then
    expect(childElement).toBeInTheDocument();
  });

  it('Should override className with default value', () => {
    // Given
    const defaultClassName = 'size-(--font-size-8)';

    // When
    render(
      <BaseIcon>
        <TestIcon />
      </BaseIcon>
    );
    const childElement = screen.getByTestId(testId);

    // Then
    expect(childElement).toHaveClass(defaultClassName);
  });

  it('Should override className with custom value', () => {
    // Given
    const classes = 'size-(--font-size-1)';

    // When
    render(
      <BaseIcon className={classes}>
        <TestIcon />
      </BaseIcon>
    );
    const childElement = screen.getByTestId(testId);

    // Then
    expect(childElement).toHaveClass(classes);
  });
});
