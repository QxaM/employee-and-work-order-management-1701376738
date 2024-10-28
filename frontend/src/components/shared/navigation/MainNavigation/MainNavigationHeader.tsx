import { NavLink } from 'react-router-dom';
import Logo from '../../Logo.tsx';

const MainNavigationHeader = () => {
  let navShared = 'text-lg py-1 px-2 m-2 rounded';
  let navInactive =
    navShared +
    ' text-qxam-neutral-light-lightest hover:underline hover:shadow-md' +
    ' hover:text-qxam-primary-darkest hover:bg-qxam-primary-lightest';
  let navActive =
    navShared +
    ' shadow-md text-qxam-primary-darkest bg-qxam-primary-lightest' +
    ' hover:underline hover:text-qxam-primary-darker';

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
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? navActive : navInactive)}
        >
          Home
        </NavLink>
      </nav>
      <div className="flex justify-center items-center content-auto">
        <button className="btn btn-secondary-lightest text-lg mr-2 border-qxam-neutral-dark-lightest border rounded shadow">
          Example
        </button>
      </div>
    </header>
  );
};

export default MainNavigationHeader;
