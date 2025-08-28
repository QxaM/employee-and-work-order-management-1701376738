import ProfileSection from '../../../src/components/profile/ProfileSection.tsx';
import { render, screen } from '@testing-library/react';

describe('ProfileSection', () => {
  const title = 'Test Title';

  it('Should render title', () => {
    // Given
    render(<ProfileSection title={title} />);

    // When
    const titleElement = screen.getByRole('heading', { name: title });

    // Then
    expect(titleElement).toBeInTheDocument();
  });

  it('Should render children', () => {
    // Given
    const children = 'Test children';
    render(<ProfileSection title={title}>{children}</ProfileSection>);

    // When
    const childrenElement = screen.getByText(children);

    // Then
    expect(childrenElement).toBeInTheDocument();
  });
});
