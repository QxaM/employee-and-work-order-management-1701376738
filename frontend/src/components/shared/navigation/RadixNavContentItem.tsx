import { ForwardedRef, forwardRef, PropsWithChildren } from 'react';
import { NavigationMenu } from 'radix-ui';
import { NavLink, NavLinkProps } from 'react-router-dom';
import clsx from 'clsx/lite';

interface RadixNavContentItemProps extends NavLinkProps {
  title: string;
  className?: string;
}

const RadixNavContentItem = forwardRef(
  (
    {
      className = '',
      children,
      title,
      ...props
    }: PropsWithChildren<RadixNavContentItemProps>,
    forwardedRef: ForwardedRef<HTMLAnchorElement>
  ) => {
    const linkClasses = clsx(
      className,
      'focus:shadow-[0_0_0_2px] focus:shadow-violet-7 hover:bg-violet-3',
      'block select-none w-full outline-none transition-colors',
      'rounded-(--radius-4) p-(--space-3) text-(length:--font-size-3) leading-none no-underline'
    );

    return (
      <li>
        <NavigationMenu.Link asChild>
          <NavLink className={linkClasses} {...props} ref={forwardedRef}>
            <div className="text-violet-12 mb-(--size-1) font-medium leading-[1.2]">
              {title}
            </div>
            <p className="text-gray-11 leading-[1.4]">{children}</p>
          </NavLink>
        </NavigationMenu.Link>
      </li>
    );
  }
);

RadixNavContentItem.displayName = 'ListItem';

export default RadixNavContentItem;
