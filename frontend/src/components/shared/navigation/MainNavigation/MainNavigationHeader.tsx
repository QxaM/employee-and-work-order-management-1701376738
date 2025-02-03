import { Link, NavLink } from 'react-router-dom';
import Logo from '../../Logo';
import { useAppSelector } from '@/hooks/useStore.tsx';

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

  const token = useAppSelector((state) => state.auth.token);

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
        <div className="flex justify-center items-center content-auto text-xl">
          Welcome back!
        </div>
      )}
    </header>
  );
};

export default MainNavigationHeader;
