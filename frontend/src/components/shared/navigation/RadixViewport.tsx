import { NavigationMenu } from 'radix-ui';
import clsx from 'clsx/lite';

const RadixViewport = () => {
  const viewportClasses = clsx(
    'relative shadow-[0_2px_10px] shadow-gray-8 mt-(--space-3)',
    'origin-[top_center] w-full',
    'rounded-md bg-violet-2 transition-[width,_height] overflow-hidden',
    'duration-300 data-[state=closed]:animate-scaleOut data-[state=open]:animate-scaleIn'
  );

  return (
    <div className="absolute left-0 top-full flex justify-center perspective-[2000px] ">
      <NavigationMenu.Viewport
        className={viewportClasses}
        style={{
          height: 'var(--radix-navigation-menu-viewport-height)',
          width: 'var(--radix-navigation-menu-viewport-width)',
        }}
      />
    </div>
  );
};

export default RadixViewport;
