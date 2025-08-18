import { NavigationMenu } from 'radix-ui';
import clsx from 'clsx/lite';

const RadixIndicator = () => {
  const indicatorClasses = clsx(
    'top-full z-10 flex h-2 items-end justify-center',
    'transition-[width,transform] duration-300 ease-in-out',
    'data-[state=hidden]:animate-fadeOut data-[state=visible]:animate-fadeIn'
  );

  return (
    <NavigationMenu.Indicator className={indicatorClasses}>
      <div className="relative top-[100%] size-2 rotate-45 rounded-tl-(--radius-1) bg-violet-2" />
    </NavigationMenu.Indicator>
  );
};

export default RadixIndicator;
