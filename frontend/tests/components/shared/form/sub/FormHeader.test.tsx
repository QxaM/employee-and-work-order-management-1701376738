import { render, screen } from '@testing-library/react';
import { EnvelopeClosedIcon } from '@radix-ui/react-icons';
import FormHeader from '../../../../../src/components/shared/form/sub/FormHeader.tsx';

describe('FormHeader', () => {
  const title = 'Test title';
  const iconTestId = 'icon';
  const TestIcon = () => <EnvelopeClosedIcon data-testid={iconTestId} />;

  it('Should render icon', () => {
    // Given

    // When
    render(<FormHeader title={title} icon={TestIcon} />);
    const iconElement = screen.getByTestId(iconTestId);

    // Then
    expect(iconElement).toBeInTheDocument();
  });

  it('Should render title', () => {
    // Given

    // When
    render(<FormHeader title={title} icon={TestIcon} />);
    const titleElement = screen.getByText(title);

    // Then
    expect(titleElement).toBeInTheDocument();
  });

  it('Should render description', () => {
    // Given
    const description = 'Test description';

    // When
    render(
      <FormHeader title={title} icon={TestIcon} description={description} />
    );
    const descriptionElement = screen.getByText(description);

    // Then
    expect(descriptionElement).toBeInTheDocument();
  });
});
