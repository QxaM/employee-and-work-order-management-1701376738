import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { act, fireEvent, screen } from '@testing-library/react';

import MobileMainNavigation
  from '../../../../../src/components/shared/navigation/main-navigation/MobileMainNavigation.tsx';
import { renderWithProviders } from '../../../../test-utils.tsx';
import { login } from '../../../../../src/store/authSlice.ts';
import { MeType } from '../../../../../src/store/api/auth.ts';
import * as useMeDataModule from '../../../../../src/hooks/useMeData.tsx';
import { RootState } from '../../../../../src/store';

describe('Main Navigation Header', () => {
  beforeEach(() => {
    vi.spyOn(useMeDataModule, 'useMeData').mockReturnValue({
      me: undefined,
      isLoading: false,
      isError: true,
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('Should contain Logo component', () => {
    // Given
    const appName = 'MaxQ';
    renderWithProviders(
      <BrowserRouter>
        <MobileMainNavigation />
      </BrowserRouter>
    );

    // When
    const headerElement = screen.getByText(appName, { exact: false });

    // Then
    expect(headerElement).toBeInTheDocument();
  });

  it('Should contain hamburger menu button', () => {
    // Given
    const ariaLabel = 'Toggle navigation menu';
    renderWithProviders(
      <BrowserRouter>
        <MobileMainNavigation />
      </BrowserRouter>
    );

    // When
    const menuButton = screen.getByRole('button', {
      name: new RegExp(ariaLabel, 'i'),
    });

    // Then
    expect(menuButton).toBeInTheDocument();
  });

  it('Should open menu after clicking hamburger button', async () => {
    // Given
    const navHomeText = 'Home';
    const ariaLabel = 'Toggle navigation menu';
    renderWithProviders(
      <BrowserRouter>
        <MobileMainNavigation />
      </BrowserRouter>
    );
    const menuButton = screen.getByRole('button', {
      name: new RegExp(ariaLabel, 'i'),
    });

    // When
    fireEvent.click(menuButton);
    const homeLink = await screen.findByText(navHomeText, { exact: false });

    // Then
    expect(homeLink).toBeInTheDocument();
  });

  describe('Navigation', () => {
    describe('Default navigation buttons', () => {
      beforeEach(() => {
        const ariaLabel = 'Toggle navigation menu';

        renderWithProviders(
          <BrowserRouter>
            <MobileMainNavigation />
          </BrowserRouter>
        );
        const menuButton = screen.getByRole('button', {
          name: new RegExp(ariaLabel, 'i'),
        });

        fireEvent.click(menuButton);
      });

      it('Should contain Home navigation link', async () => {
        // Given
        const navHomeText = 'Home';

        // When
        const homeLink = await screen.findByText(navHomeText, { exact: false });

        // Then
        expect(homeLink).toBeInTheDocument();
      });

      it('Should navigate home, when "Home" is clicked', async () => {
        // Given
        const navHomeText = 'Home';
        const homeLink = await screen.findByText(navHomeText, { exact: false });

        // When
        fireEvent.click(homeLink);

        // Then
        expect(window.location.pathname).toBe('/');
      });
    });

    describe('Tasks navigation buttons', () => {
      const navTasksText = 'Tasks';

      beforeEach(() => {
        const ariaLabel = 'Toggle navigation menu';
        const preloadedState: Partial<RootState> = {
          auth: {
            token: 'test-token',
          },
        };

        renderWithProviders(
          <BrowserRouter>
            <MobileMainNavigation />
          </BrowserRouter>,
          {
            preloadedState,
          }
        );
        const menuButton = screen.getByRole('button', {
          name: new RegExp(ariaLabel, 'i'),
        });

        fireEvent.click(menuButton);
      });

      it('Should contain Tasks navigation link, when logged in as any user', () => {
        // Given

        // When
        const tasksLink = screen.getByText(navTasksText, { exact: false });

        // Then
        expect(tasksLink).toBeInTheDocument();
      });

      it('Should navigate to Tasks navigation link, when logged in as any user', () => {
        // Given
        const tasksLink = screen.getByText(navTasksText, { exact: false });

        // When
        fireEvent.click(tasksLink);

        // Then
        expect(window.location.pathname).toBe('/tasks');
      });
    });

    describe('Admin navigation buttons', () => {
      beforeEach(() => {
        const ariaLabel = 'Toggle navigation menu';
        const me: MeType = {
          email: 'test@test.com',
          roles: [
            {
              id: 1,
              name: 'ADMIN',
            },
          ],
        };
        vi.spyOn(useMeDataModule, 'useMeData').mockReturnValue({
          me,
          isLoading: false,
          isError: false,
        });

        renderWithProviders(
          <BrowserRouter>
            <MobileMainNavigation />
          </BrowserRouter>
        );
        const menuButton = screen.getByRole('button', {
          name: new RegExp(ariaLabel, 'i'),
        });

        fireEvent.click(menuButton);
      });

      it('Should contain Admin navigation link, when is logged as admin', async () => {
        // Given
        const navAdminText = 'Admin';

        // When
        const adminLink = await screen.findByText(navAdminText, {
          exact: false,
        });

        // Then
        expect(adminLink).toBeInTheDocument();
      });

      it('Should navigate to Admin, when admin nav is clicked', async () => {
        // Given
        const navAdminText = 'Admin';

        const adminLink = await screen.findByText(navAdminText, {
          exact: false,
        });

        // When
        fireEvent.click(adminLink);

        // Then
        expect(window.location.pathname).toBe('/admin');
      });
    });
  });

  describe('Login and Register', () => {
    it('Should contain Register Button', async () => {
      // Given
      const registerButtonText = 'Sign up';
      const ariaLabel = 'Toggle navigation menu';

      renderWithProviders(
        <BrowserRouter>
          <MobileMainNavigation />
        </BrowserRouter>
      );
      const menuButton = screen.getByRole('button', {
        name: new RegExp(ariaLabel, 'i'),
      });

      fireEvent.click(menuButton);

      // When
      const registerButton = await screen.findByRole('link', {
        name: registerButtonText,
      });

      // Then
      expect(registerButton).toBeInTheDocument();
    });

    it('Should navigate to register page', async () => {
      // Given
      const registerButtonText = 'Sign up';
      const ariaLabel = 'Toggle navigation menu';

      renderWithProviders(
        <BrowserRouter>
          <MobileMainNavigation />
        </BrowserRouter>
      );
      const menuButton = screen.getByRole('button', {
        name: new RegExp(ariaLabel, 'i'),
      });
      fireEvent.click(menuButton);

      const registerButton = await screen.findByRole('link', {
        name: registerButtonText,
      });

      // When
      fireEvent.click(registerButton);

      // Then
      expect(window.location.pathname).toBe('/register');
    });

    it('Should contain Login Button', async () => {
      // Given
      const loginButtonText = 'Login';
      const ariaLabel = 'Toggle navigation menu';

      renderWithProviders(
        <BrowserRouter>
          <MobileMainNavigation />
        </BrowserRouter>
      );
      const menuButton = screen.getByRole('button', {
        name: new RegExp(ariaLabel, 'i'),
      });

      fireEvent.click(menuButton);

      // When
      const loginButton = await screen.findByRole('link', {
        name: loginButtonText,
      });

      // Then
      expect(loginButton).toBeInTheDocument();
    });

    it('Should navigate to login page', async () => {
      // Given
      const loginButtonText = 'Login';
      const ariaLabel = 'Toggle navigation menu';

      renderWithProviders(
        <BrowserRouter>
          <MobileMainNavigation />
        </BrowserRouter>
      );
      const menuButton = screen.getByRole('button', {
        name: new RegExp(ariaLabel, 'i'),
      });
      fireEvent.click(menuButton);

      const loginButton = await screen.findByRole('link', {
        name: loginButtonText,
      });

      // When
      fireEvent.click(loginButton);

      // Then
      expect(window.location.pathname).toBe('/login');
    });

    it('Should contain welcome message, logout button and Profile Card when logged in', async () => {
      // Given
      const loginButtonText = 'Login';
      const email = 'test@test.com';
      vi.spyOn(useMeDataModule, 'useMeData').mockReturnValue({
        me: {
          email,
          roles: [
            {
              id: 1,
              name: 'TEST',
            },
          ],
        },
        isLoading: false,
        isError: false,
      });

      const { store } = renderWithProviders(
        <BrowserRouter>
          <MobileMainNavigation />
        </BrowserRouter>
      );

      const ariaLabel = 'Toggle navigation menu';
      const menuButton = screen.getByRole('button', {
        name: new RegExp(ariaLabel, 'i'),
      });
      fireEvent.click(menuButton);

      // When
      act(() => {
        store.dispatch(login({ token: '12345' }));
      });

      const loginButton = screen.queryByRole('link', {
        name: loginButtonText,
      });
      const welcomeMessage = await screen.findByText(
        `Welcome back, test@test.com!`
      );
      const profileCard = await screen.findByRole('button', {
        name: email.charAt(0).toUpperCase(),
      });

      // Then
      expect(loginButton).not.toBeInTheDocument();
      expect(welcomeMessage).toBeInTheDocument();
      expect(profileCard).toBeInTheDocument();
    });
  });
});
