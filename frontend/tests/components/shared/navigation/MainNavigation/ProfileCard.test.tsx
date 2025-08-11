import * as useMeDataModule from '../../../../../src/hooks/useMeData';
import { render, screen } from '@testing-library/react';
import ProfileCard from '../../../../../src/components/shared/navigation/MainNavigation/ProfileCard.tsx';

describe('ProfileCard', () => {
  it('should display first letter of email on profile-card', () => {
    // Given
    const email = 'test@test.com';
    const expectedFirstLetter = email.charAt(0);
    vi.spyOn(useMeDataModule, 'useMeData').mockReturnValue({
      me: {
        email,
        roles: [
          {
            id: 1,
            name: 'ADMIN',
          },
        ],
      },
      isLoading: false,
      isError: false,
    });

    // When
    render(<ProfileCard />);
    const firsLetterElement = screen.getByText(expectedFirstLetter);

    // Then
    expect(firsLetterElement).toBeInTheDocument();
  });

  it('should display nothing when no me data', () => {
    // Given
    const email = 'test@test.com';
    const expectedFirstLetter = email.charAt(0);
    vi.spyOn(useMeDataModule, 'useMeData').mockReturnValue({
      me: undefined,
      isLoading: true,
      isError: false,
    });

    // When
    render(<ProfileCard />);
    const firsLetterElement = screen.queryByText(expectedFirstLetter);

    // Then
    expect(firsLetterElement).not.toBeInTheDocument();
  });
});
