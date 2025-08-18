import Logo from '../../Logo';
import { useAppDispatch, useAppSelector } from '../../../../hooks/useStore.tsx';
import { isAdmin as checkJwtIsAdmin } from '../../../../utils/authUtils.ts';
import { useMeData } from '../../../../hooks/useMeData.tsx';
import { Button, Flex } from '@radix-ui/themes';
import { NavigationMenu } from 'radix-ui';
import RadixLink from '../../RadixLink.tsx';
import WelcomeMessage from './WelcomeMessage.tsx';
import { logout } from '../../../../store/authSlice.ts';
import RadixNavLink from '../RadixNavLink.tsx';
import RadixExpandableNavLink from '../RadixExpandableNavLink.tsx';
import RadixNavContent from '../RadixNavContent.tsx';
import RadixIndicator from '../RadixIndicator.tsx';
import RadixViewport from '../RadixViewport.tsx';
import RadixNavContentItem from '../RadixNavContentItem.tsx';
import { useMemo } from 'react';

/**
 * Renders the main navigation header with links and conditional content
 * based on the user's authentication state.
 *
 * This header should be displayed on large (Web) screens.
 *
 * Features:
 * - Displays the logo and navigation links.
 * - Shows "Sign up" and "Login" links for unauthenticated users.
 * - Displays a welcome message for authenticated users.
 */
const MainNavigationHeader = () => {
  const dispatch = useAppDispatch();
  const { me } = useMeData();

  const token = useAppSelector((state) => state.auth.token);
  const isAdmin = useMemo(() => checkJwtIsAdmin(me), [me]);

  return (
    <Flex
      justify="between"
      align="center"
      content="auto"
      gap="2"
      px="2"
      className="text-(--accent-contrast) bg-(--accent-9) rounded-(--radius-3) shadow-[0_2px_10px] shadow-gray-8"
    >
      <Logo />

      <NavigationMenu.Root className="relative z-10 flex justify-center">
        <NavigationMenu.List className="center m-0 flex list-none justify-center items-center gap-(--space-2)">
          <NavigationMenu.Item>
            <RadixNavLink to={'/'}>Home</RadixNavLink>
          </NavigationMenu.Item>

          {isAdmin && (
            <NavigationMenu.Item>
              <RadixExpandableNavLink to={'/admin'}>
                Admin
              </RadixExpandableNavLink>
              <RadixNavContent width="1">
                <RadixNavContentItem
                  title="Roles Update"
                  to="/admin/roles-update"
                >
                  View and change users&apos; assigned roles
                </RadixNavContentItem>
              </RadixNavContent>
            </NavigationMenu.Item>
          )}

          <RadixIndicator />
        </NavigationMenu.List>

        <RadixViewport />
      </NavigationMenu.Root>

      {!token && (
        <Flex justify="center" align="center" content="auto" gap="2" mx="2">
          <RadixLink to="/register" variant="surface" size="3">
            Sign up
          </RadixLink>
          <RadixLink to="/login" size="3">
            Login
          </RadixLink>
        </Flex>
      )}
      {token && (
        <Flex justify="center" align="center" content="auto" gap="2" mx="2">
          <WelcomeMessage me={me} />
          <Button
            size="3"
            className="!cursor-pointer"
            onClick={() => dispatch(logout())}
          >
            Logout
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default MainNavigationHeader;
