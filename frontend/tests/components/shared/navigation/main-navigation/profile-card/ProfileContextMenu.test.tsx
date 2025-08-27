import { PropsWithChildren } from 'react';
import { Button, DropdownMenu } from '@radix-ui/themes';
import { beforeEach, describe } from 'vitest';
import { renderWithProviders } from '../../../../../test-utils.tsx';
import ProfileContextMenu from '../../../../../../src/components/shared/navigation/main-navigation/profile-card/ProfileContextMenu.tsx';
import { screen } from '@testing-library/react';
import { UserEvent, userEvent } from '@testing-library/user-event';

const openContext = 'Open context';

const TestWrapper = ({ children }: PropsWithChildren) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button>{openContext}</Button>
      </DropdownMenu.Trigger>
      {children}
    </DropdownMenu.Root>
  );
};

describe('ProfileContextMenu', () => {
  let user: UserEvent;

  beforeEach(() => {
    user = userEvent.setup();
  });

  describe('Profile navigation', () => {
    const profileTitle = 'Profile';

    it('Should render profile button', async () => {
      // Given
      renderWithProviders(
        <TestWrapper>
          <ProfileContextMenu />
        </TestWrapper>
      );
      const triggerButton = screen.getByText(openContext);
      await user.click(triggerButton);

      // When
      const profileElement = await screen.findByText(profileTitle);

      // Then
      expect(profileElement).toBeInTheDocument();
    });
  });

  describe('Logout button', () => {
    const logoutTitle = 'Logout';

    it('Should render logout button', async () => {
      // Given
      renderWithProviders(
        <TestWrapper>
          <ProfileContextMenu />
        </TestWrapper>
      );
      const triggerButton = screen.getByText(openContext);
      await user.click(triggerButton);

      // When
      const logoutElement = await screen.findByText(logoutTitle);

      // Then
      expect(logoutElement).toBeInTheDocument();
    });

    it('Should call logout function', async () => {
      // Given
      const { store } = renderWithProviders(
        <TestWrapper>
          <ProfileContextMenu />
        </TestWrapper>,
        {
          preloadedState: {
            auth: {
              token: 'test-token',
            },
          },
        }
      );
      const triggerButton = screen.getByText(openContext);
      await user.click(triggerButton);
      const logoutElement = await screen.findByText(logoutTitle);

      // When
      await user.click(logoutElement);

      // Then
      expect(store.getState().auth.token).toBeUndefined();
    });
  });
});
