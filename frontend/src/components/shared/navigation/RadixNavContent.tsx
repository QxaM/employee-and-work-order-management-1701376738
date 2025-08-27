import { NavigationMenu } from 'radix-ui';
import { PropsWithChildren } from 'react';
import clsx from 'clsx/lite';

const sizeClasses = {
  '1': 'w-[400px]',
  '2': 'w-[500px]',
  '3': 'w-[600px]',
  '4': 'w-[700px]',
  '5': 'w-[800px]',
  '6': 'w-[900px]',
  '7': 'w-[1000px]',
} as const;

interface RadixNavContentProps {
  width?: keyof typeof sizeClasses;
}

const RadixNavContent = ({
  width = '3',
  children,
}: PropsWithChildren<RadixNavContentProps>) => {
  const contentClasses = clsx(
    'absolute left-0 top-0 w-auto',
    'data-[motion=from-end]:animate-enterFromRight data-[motion=from-start]:animate-enterFromLeft',
    'data-[motion=to-end]:animate-exitToRight data-[motion=to-start]:animate-exitToLeft'
  );

  const listClasses = clsx(
    sizeClasses[width],
    'm-0 grid list-none',
    'gap-x-(--space-2) p-(--space-6)',
    'sm:grid-flow-col sm:grid-rows-3'
  );

  return (
    <NavigationMenu.Content className={contentClasses}>
      <ul className={listClasses}>{children}</ul>
    </NavigationMenu.Content>
  );
};

export default RadixNavContent;
