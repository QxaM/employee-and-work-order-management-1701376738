import { motion } from 'framer-motion';

const SpinnerSize = {
  small: 'w-8 h-8 border-[5px]',
  medium: 'w-12 h-12 border-[6px]',
  large: 'w-16 h-16 border-[7px]',
};

type SizeType = keyof typeof SpinnerSize;

const SpinnerColor = {
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

type ColorType = keyof typeof SpinnerColor;

interface SpinnerType {
  size?: SizeType;
  color?: ColorType;
}

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
