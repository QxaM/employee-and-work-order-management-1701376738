import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import Logo from '../../Logo.tsx';
import { useAppDispatch, useAppSelector } from '../../../../hooks/useStore.tsx';
import { isAdmin as checkJwtIsAdmin } from '../../../../utils/authUtils.ts';
import { logout } from '../../../../store/authSlice.ts';
import { useMeData } from '../../../../hooks/useMeData.tsx';
import WelcomeMessage from './WelcomeMessage.tsx';

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

  const navShared = 'text-xl py-4 px-2 w-2/3 m-2 rounded font-bold';
  const navInactive =
    navShared +
    ' text-qxam-neutral-light-lightest hover:underline hover:shadow-md' +
    ' hover:text-qxam-primary-darkest hover:bg-qxam-primary-lightest';
  const navActive =
    navShared +
    ' shadow-md text-qxam-primary-darkest bg-qxam-primary-lightest' +
    ' hover:underline hover:text-qxam-primary-darker';

  const dispatch = useAppDispatch();
  const { me } = useMeData();

  const token = useAppSelector((state) => state.auth.token);
  const isAdmin = checkJwtIsAdmin(me);

  return (
    <header className="bg-qxam-primary shadow-lg">
      <div className="flex justify-between items-center">
        <Logo />
        <div className="flex justify-center items-center content-auto">
          <button
            aria-label="Toggle navigation menu"
            className={`btn text-lg m-2 rounded-md border-[3px] border-qxam-primary-darkest transform transition-all duration-300 ease-in-out p-2 ${isOpen ? 'border-opacity-0' : 'border-opacity-100'}`}
            onClick={() => {
              setIsOpen((prevOpen) => !prevOpen);
            }}
          >
            <div className="flex flex-col justify-between h-5 w-6">
              {/* First line */}
              <span
                className={`h-0.5 w-full bg-qxam-primary-darkest transform transition-all duration-300 ease-in-out ${
                  isOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />

              {/* Middle line */}
              <span
                className={`h-0.5 w-full bg-qxam-primary-darkest transform transition-all duration-300 ease-in-out ${
                  isOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />

              {/* Bottom line */}
              <span
                className={`h-0.5 w-full bg-qxam-primary-darkest transform transition-all duration-300 ease-in-out ${
                  isOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex flex-col items-center justify-center text-center"
          >
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? navActive : navInactive)}
            >
              Home
            </NavLink>
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  isActive ? navActive : navInactive
                }
              >
                Admin
              </NavLink>
            )}
            {!token && (
              <>
                <Link
                  to="/register"
                  className="text-xl py-4 px-2 w-2/3 m-2 mt-4 btn btn-secondary-lightest border-qxam-neutral-dark-lightest border rounded shadow"
                >
                  Sign up
                </Link>
                <Link
                  to="/login"
                  className="text-xl py-4 px-2 w-2/3 m-2 mt-0 btn btn-primary-darkest border-qxam-neutral-dark-lighter border rounded shadow text-center"
                >
                  Login
                </Link>
              </>
            )}
            {token && (
              <div className="flex flex-row flex-grow gap-4 justify-between mx-4 my-2 w-2/3 items-center">
                <WelcomeMessage me={me} />
                <button
                  className="btn btn-secondary-lightest text-lg mr-2 min-w-20 border-qxam-neutral-dark-lightest border rounded shadow text-center"
                  onClick={() => dispatch(logout())}
                >
                  Logout
                </button>
              </div>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default MobileMainNavigation;
