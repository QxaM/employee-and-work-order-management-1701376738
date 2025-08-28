import { CaretDownIcon } from '@radix-ui/react-icons';
import { NavigationMenu } from 'radix-ui';
import { PropsWithChildren } from 'react';
import RadixNavLink from './RadixNavLink.tsx';

interface RadixExpandableNavLinkProps {
  to: string;
}

const RadixExpandableNavLink = ({
  to,
  children,
}: PropsWithChildren<RadixExpandableNavLinkProps>) => {
  return (
    <NavigationMenu.Trigger className="group flex select-none items-center justify-between">
      <RadixNavLink to={to}>
        {children}{' '}
        <CaretDownIcon
          className="relative top-px transition-transform duration-300 ease-in group-data-[state=open]:-rotate-180"
          aria-hidden
        />
      </RadixNavLink>
    </NavigationMenu.Trigger>
  );
};

export default RadixExpandableNavLink;
