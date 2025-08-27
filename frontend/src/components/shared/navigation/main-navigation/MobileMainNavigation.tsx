import { useState } from 'react';

import Logo from '../../Logo.tsx';
import { useAppSelector } from '../../../../hooks/useStore.tsx';
import { isAdmin as checkJwtIsAdmin } from '../../../../utils/authUtils.ts';
import { useMeData } from '../../../../hooks/useMeData.tsx';
import WelcomeMessage from './WelcomeMessage.tsx';
import { Box, Button, Flex } from '@radix-ui/themes';
import clsx from 'clsx/lite';
import { NavigationMenu } from 'radix-ui';
import RadixNavLink from '../RadixNavLink.tsx';
import LinkButton from '../../LinkButton.tsx';
import ProfileCard from './profile-card/ProfileCard.tsx';

/**
 * Renders the main navigation header with links and conditional content
 * based on the user's authentication state and navigation opened state.
 *
 * This header should be displayed on mobile screens.
 *
 * Features:
 * - Displays the logo and navigation links.
 * - Shows hamburger button to open navigation manu
 * - Shows "Sign up" and "Login" links for unauthenticated users.
 * - Displays a welcome message for authenticated users.
 */
const MobileMainNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const hamburgerLineShared =
    'h-0.5 w-full bg-(--accent-12) transform transition-all duration-300 ease-in-out';
  const navigationMenuClasses = clsx(
    'absolute top-full left-0 w-full z-10 py-(--space-4) bg-(--accent-9) rounded-(--radius-3)',
    'flex flex-col justify-center items-center text-center [&>div]:flex [&>div]:flex-col',
    '[&>div]:items-center [&>div]:justify-center [&>div]:text-center [&>div]:w-full',
    'transition-all animate-enterFromTop'
  );

  const { me } = useMeData();

  const token = useAppSelector((state) => state.auth.token);
  const isAdmin = checkJwtIsAdmin(me);

  return (
    <Box
      px="2"
      className="relative text-(--accent-contrast) bg-(--accent-9) rounded-(--radius-3) shadow-[0_2px_10px] shadow-gray-8"
    >
      <Flex justify="between" align="center" className="z-50">
        <Logo />
        <Flex direction="row" justify="end" align="center" gap="2">
          {token && <ProfileCard />}
          <Button
            variant="outline"
            aria-label="Toggle navigation menu"
            className="transform transition-all duration-300 ease-in-out"
            onClick={() => {
              setIsOpen((prevOpen) => !prevOpen);
            }}
          >
            <Flex
              width="20px"
              height="20px"
              direction="column"
              justify="between"
              align="center"
            >
              {/* First line */}
              <span
                className={clsx(
                  hamburgerLineShared,
                  isOpen ? 'rotate-45 translate-y-[9px]' : ''
                )}
              />
              {/* Middle line */}
              <span
                className={clsx(
                  hamburgerLineShared,
                  isOpen ? 'opacity-0' : 'opacity-100'
                )}
              />
              {/* Bottom line */}
              <span
                className={clsx(
                  hamburgerLineShared,
                  isOpen ? '-rotate-45 -translate-y-[9px]' : ''
                )}
              />
            </Flex>
          </Button>
        </Flex>
      </Flex>
      {isOpen && (
        <NavigationMenu.Root
          orientation="vertical"
          className={navigationMenuClasses}
        >
          <NavigationMenu.List className="m-0 flex flex-col w-2/3 list-none justify-center items-center gap-(--space-2)">
            <NavigationMenu.Item className="w-full">
              <RadixNavLink to="/">Home</RadixNavLink>
            </NavigationMenu.Item>
            {isAdmin && (
              <NavigationMenu.Item className="w-full">
                <RadixNavLink to="/admin">Admin</RadixNavLink>
              </NavigationMenu.Item>
            )}
          </NavigationMenu.List>
          {!token && (
            <Flex
              direction="row"
              justify="between"
              align="center"
              content="auto"
              mt="4"
              className="!w-2/3"
            >
              <LinkButton to="/register" variant="surface" size="3">
                Sign up
              </LinkButton>
              <LinkButton to="/login" size="3">
                Login
              </LinkButton>
            </Flex>
          )}
          {token && (
            <Flex
              direction="row"
              justify="between"
              align="center"
              gap="4"
              mt="5"
              className="!w-2/3"
            >
              <WelcomeMessage me={me} />
            </Flex>
          )}
        </NavigationMenu.Root>
      )}
    </Box>
  );
};

export default MobileMainNavigation;
