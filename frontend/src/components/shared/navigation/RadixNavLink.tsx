import { NavLink, NavLinkProps, NavLinkRenderProps } from 'react-router-dom';
import { PropsWithChildren } from 'react';
import clsx from 'clsx';

const RadixNavLink = ({ to, children }: PropsWithChildren<NavLinkProps>) => {
  const getNavClasses = ({ isActive }: NavLinkRenderProps) => {
    return clsx(
      'text-(length:--font-size-4) p-(--space-1) rounded-(--radius-2)',
      'flex justify-center items-center gap-(--space-1) group',
      isActive
        ? 'shadow-(--shadow-3) text-(--accent-12) bg-(--accent-3) hover:underline'
        : 'text-(--accent-contrast) hover:text-(--accent-1) hover:bg-(--accent-8)'
    );
  };

  return (
    <NavLink to={to} className={getNavClasses}>
      {children}
    </NavLink>
  );
};

export default RadixNavLink;
