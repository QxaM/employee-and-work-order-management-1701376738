import { Link, NavLink } from 'react-router-dom';

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
      <Link to="/" className="flex items-center" reloadDocument>
        <img
          src="/maxq-logo.jpg"
          alt="MaxQ Logo with text panel and synthwave background"
          height={42}
          width={42}
          className="m-2 shadow-xl"
        />
        <h1 className="text-qxam-neutral-light-lightest text-xl font-extrabold">
          MaxQ Work Manager
        </h1>
      </Link>
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
        <button className="btn-accent">Example</button>
      </div>
    </header>
  );
};

export default MainNavigationHeader;
