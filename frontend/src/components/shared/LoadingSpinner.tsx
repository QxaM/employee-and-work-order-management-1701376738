import { Color, Size } from '../../types/TailwindTypes.ts';
import { PropsWithChildren } from 'react';
import clsx from 'clsx/lite';

const SpinnerSize: Record<Size, string> = {
  small: 'size-(--space-5) border-[5px]',
  medium: 'size-(--space-7) border-[6px]',
  large: 'size-(--space-9) border-[7px]',
};

const SpinnerColor: Record<Color, string> = {
  violet: 'border-violet-5 border-t-violet-9',
  gray: 'border-gray-5 border-t-gray-9',
};

interface SpinnerType {
  size?: Size;
  color?: Color;
  isLoading?: boolean;
}

/**
 * Animated loading spinner customizable component utilizing.
 *
 * @param {SpinnerType} props - Props for the LoadingSpinner component.
 * @param {Size} [props.size="medium"] - The size of the spinner; options are "small", "medium", or
 * "large".
 * @param {Color} [props.color="primary"] - The color theme of the spinner; options include
 * "primary", "secondary", "accent", etc.
 *
 * @example
 * // Render a medium primary-colored spinner:
 * <LoadingSpinner />
 *
 * // Render a large spinner with an error color theme:
 * <LoadingSpinner size="large" color="error" />
 */

const LoadingSpinner = ({
  size = 'medium',
  color = 'violet',
  isLoading,
  children,
}: PropsWithChildren<SpinnerType>) => {
  const spinnerClasses = clsx(
    SpinnerSize[size],
    SpinnerColor[color],
    'rounded-full',
    'transition-all duration-1000 ease-in-out animate-spin'
  );

  return (
    <>
      {isLoading && <div data-testid="spinner" className={spinnerClasses} />}
      {!isLoading && <>{children}</>}
    </>
  );
};

export default LoadingSpinner;
