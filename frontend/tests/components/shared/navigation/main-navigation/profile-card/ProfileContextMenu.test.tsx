import { PropsWithChildren } from 'react';
import { Button, DropdownMenu } from '@radix-ui/themes';
import { afterEach, beforeEach, describe } from 'vitest';
import * as useAuthModule from '../../../../../../src/hooks/useAuth.tsx';
import { renderWithProviders } from '../../../../../test-utils.tsx';
import ProfileContextMenu from '../../../../../../src/components/shared/navigation/main-navigation/profile-card/ProfileContextMenu.tsx';
import { screen } from '@testing-library/react';
import { UserEvent, userEvent } from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

const openContext = 'Open context';

const TestWrapper = ({ children }: PropsWithChildren) => {
  return (
    <BrowserRouter>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button>{openContext}</Button>
        </DropdownMenu.Trigger>
        {children}
      </DropdownMenu.Root>
    </BrowserRouter>
  );
};

describe('ProfileContextMenu', () => {
  let user: UserEvent;
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    user = userEvent.setup();

    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      login: {
        trigger: vi.fn(),
        data: undefined,
        isSuccess: false,
        isPending: false,
        isError: false,
      },
      logout: {
        trigger: mockLogout,
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
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

    it('Should navigate to profile page', async () => {
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
      await user.click(profileElement);

      // Then
      expect(window.location.pathname).toContain('/profile');
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
      renderWithProviders(
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
      expect(mockLogout).toHaveBeenCalledOnce();
    });
  });
});
