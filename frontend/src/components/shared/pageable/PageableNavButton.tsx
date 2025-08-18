import { Link } from 'react-router-dom';
import { CaretLeftIcon, CaretRightIcon } from '@radix-ui/react-icons';
import clsx from 'clsx/lite';
import { PageableColor } from '../../../types/PageableTypes.ts';
import { Color } from '../../../types/TailwindTypes.ts';

interface PageableNavButtonProps {
  direction: 'previous' | 'next';
  currentPage: number;
  isDisabled: boolean;
  color: Color;
}

const PageableNavButton = ({
  direction,
  currentPage,
  isDisabled,
  color,
}: PageableNavButtonProps) => {
  const buttonClass = clsx(
    'flex flex-col size-(--font-size-8) items-center justify-center rounded-full',
    isDisabled
      ? `text-(--gray-a8) pointer-events-none`
      : `${PageableColor[color].navButton} border-2`
  );
  const iconClass = clsx('size-(--space-5) text-center');

  const ariaLabel = `${direction} page`;
  const page = direction === 'previous' ? currentPage - 1 : currentPage + 1;
  const icon =
    direction === 'previous' ? (
      <CaretLeftIcon
        strokeWidth={0.25}
        stroke="currentColor"
        className={iconClass}
      />
    ) : (
      <CaretRightIcon
        strokeWidth={0.25}
        stroke="currentColor"
        className={iconClass}
      />
    );

  return (
    <Link to={`?page=${page}`} aria-label={ariaLabel} className={buttonClass}>
      <div>{icon}</div>
    </Link>
  );
};

export default PageableNavButton;
