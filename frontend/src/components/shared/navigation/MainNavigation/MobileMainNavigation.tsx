import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import Logo from '../../Logo.tsx';

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

  return (
    <header className="bg-qxam-primary shadow-lg">
      <div className="flex justify-between items-center">
        <Logo />
        <div className="flex justify-center items-center content-auto">
          <button
            aria-label="Toggle navigation menu"
            className={`btn text-lg m-2 rounded-md border-[3px] border-qxam-primary-darkest transform transition-all duration-300 ease-in-out p-2 ${isOpen ? 'border-opacity-0' : 'border-opacity-100'}`}
            onClick={() => { setIsOpen((prevOpen) => !prevOpen); }}
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
            <NavLink
              to={'/test'}
              className={({ isActive }) => (isActive ? navActive : navInactive)}
            >
              Test
            </NavLink>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default MobileMainNavigation;
