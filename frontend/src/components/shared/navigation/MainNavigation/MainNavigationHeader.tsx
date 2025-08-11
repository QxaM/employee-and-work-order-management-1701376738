import { Link, NavLink } from 'react-router-dom';
import Logo from '../../Logo';
import { useAppDispatch, useAppSelector } from '../../../../hooks/useStore.tsx';
import { isAdmin as checkJwtIsAdmin } from '../../../../utils/authUtils.ts';
import { logout } from '../../../../store/authSlice.ts';
import { useMeData } from '../../../../hooks/useMeData.tsx';
import WelcomeMessage from './WelcomeMessage.tsx';
import ProfileCard from './ProfileCard.tsx';

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
  const navShared = 'text-lg py-1 px-2 m-2 rounded';
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
    <header className="bg-qxam-primary flex justify-between items-center shadow-lg">
      <Logo />
      <nav className="flex items-center justify-center">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? navActive : navInactive)}
        >
          Home
        </NavLink>
        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) => (isActive ? navActive : navInactive)}
          >
            Admin
          </NavLink>
        )}
      </nav>
      {!token && (
        <div className="flex justify-center items-center content-auto">
          <Link
            to="/register"
            className="btn btn-secondary-lightest text-lg mr-2 min-w-20 border-qxam-neutral-dark-lightest border rounded shadow text-center"
          >
            Sign up
          </Link>
          <Link
            to="/login"
            className="btn btn-primary-darkest text-lg mr-2 min-w-20 border-qxam-neutral-dark-lighter border rounded shadow text-center"
          >
            Login
          </Link>
        </div>
      )}
      {token && (
        <div className="flex flex-row gap-4 justify-center mx-4 items-center content-auto">
          <WelcomeMessage me={me} />
          <button
            className="btn btn-secondary-lightest text-lg mr-2 min-w-20 border-qxam-neutral-dark-lightest border rounded shadow text-center"
            onClick={() => dispatch(logout())}
          >
            Logout
          </button>
          <ProfileCard />
        </div>
      )}
    </header>
  );
};

export default MainNavigationHeader;
