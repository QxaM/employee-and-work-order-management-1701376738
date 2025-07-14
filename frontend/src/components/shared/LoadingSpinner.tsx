import { motion } from 'framer-motion';
import { Color, Size } from '../../types/TailwindTypes.ts';

const SpinnerSize: Record<Size, string> = {
  small: 'w-8 h-8 border-[5px]',
  medium: 'w-12 h-12 border-[6px]',
  large: 'w-16 h-16 border-[7px]',
};

const SpinnerColor: Record<Color, string> = {
  primary: 'border-qxam-primary-lightest border-t-qxam-primary',
  secondary: 'border-qxam-secondary-lightest border-t-qxam-secondary',
  accent: 'border-qxam-accent-lightest border-t-qxam-accent',
  neutralDark: 'border-qxam-neutral-dark-lightest border-t-qxam-neutral-dark',
  neutralLight:
    'border-qxam-neutral-light-lightest border-t-qxam-neutral-light',
  success: 'border-qxam-success-lightest border-t-qxam-success',
  warning: 'border-qxam-warning-lightest border-t-qxam-warning',
  error: 'border-qxam-error-lightest border-t-qxam-error',
};

interface SpinnerType {
  size?: Size;
  color?: Color;
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
  color = 'primary',
}: SpinnerType) => {
  return (
    <motion.div
      data-testid="spinner"
      className={`${SpinnerSize[size]} rounded-full ${SpinnerColor[color]}`}
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        type: 'spring',
        ease: 'easeInOut',
        duration: 1,
      }}
    />
  );
};

export default LoadingSpinner;
