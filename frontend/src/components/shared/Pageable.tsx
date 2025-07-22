import { Color } from '../../types/TailwindTypes.ts';
import { Pageable as PageableData } from '../../types/PageableTypes.ts';
import { Link } from 'react-router-dom';

interface ElementColor {
  text: string;
  navButton: string;
  pageButton: string;
  activePageButton: string;
}

const PageableColor: Record<Color, ElementColor> = {
  primary: {
    text: 'text-qxam-primary-darker',
    navButton:
      'border-qxam-primary-lighter hover:bg-qxam-primary-extreme-light',
    pageButton: 'hover:border-qxam-primary-lighter',
    activePageButton:
      'bg-qxam-primary-darker text-qxam-primary-extreme-light shadow-qxam-primary/20',
  },
  secondary: {
    text: 'text-qxam-secondary-darker',
    navButton:
      'border-qxam-secondary-lightest hover:bg-qxam-secondary-extreme-light',
    pageButton: 'hover:border-qxam-secondary-lighter',
    activePageButton:
      'bg-qxam-secondary-darker text-qxam-secondary-extreme-light shadow-qxam-secondary/20',
  },
  accent: {
    text: 'text-qxam-accent-darker',
    navButton: 'border-qxam-accent-lightest hover:bg-qxam-accent-extreme-light',
    pageButton: 'hover:border-qxam-accent-lighter',
    activePageButton:
      'bg-qxam-accent-darker text-qxam-accent-extreme-light shadow-qxam-accent/20',
  },
  neutralDark: {
    text: 'text-qxam-neutral-dark-darker',
    navButton:
      'border-qxam-neutral-dark-lightest hover:bg-qxam-neutral-dark-extreme-light',
    pageButton: 'hover:border-qxam-neutral-dark-lighter',
    activePageButton:
      'bg-qxam-neutral-dark-darker text-qxam-neutral-dark-extreme-light' +
      ' shadow-qxam-neutral-dark/20',
  },
  neutralLight: {
    text: 'text-qxam-neutral-light-darker',
    navButton:
      'border-qxam-neutral-light-lightest hover:bg-qxam-neutral-light-extreme-light',
    pageButton: 'hover:border-qxam-neutral-light-lighter',
    activePageButton:
      'bg-qxam-neutral-light-darker text-qxam-neutral-light-extreme-light shadow-qxam-neutral-light/20',
  },
  success: {
    text: 'text-qxam-success-darker',
    navButton:
      'border-qxam-success-lightest hover:bg-qxam-success-extreme-light',
    pageButton: 'hover:border-qxam-success-lighter',
    activePageButton:
      'bg-qxam-success-darker text-qxam-success-extreme-light shadow-qxam-success/20',
  },
  warning: {
    text: 'text-qxam-warning-darker',
    navButton:
      'border-qxam-warning-lightest hover:bg-qxam-warning-extreme-light',
    pageButton: 'hover:border-qxam-warning-lighter',
    activePageButton:
      'bg-qxam-warning-darker text-qxam-warning-extreme-light shadow-qxam-warning/20',
  },
  error: {
    text: 'text-qxam-error-darker',
    navButton:
      'border-qxam-error-extreme-light hover:bg-qxam-error-extreme-light',
    pageButton: 'hover:border-qxam-error-lighter',
    activePageButton:
      'bg-qxam-error-darker text-qxam-error-extreme-light shadow-qxam-error/20',
  },
};

interface PageableProps {
  pageable: PageableData;
  color?: Exclude<Color, 'neutralLight'>;
  maxPages?: number;
}

/**
 * Represents a pageable component used for rendering and handling pagination controls in a paginated dataset.
 *
 * The component accepts a pagination configuration (`pageable`) and additional properties for customization,
 * like the color theme and the maximum number of pages to display in the pagination control.
 *
 */
const Pageable = ({
  pageable: {
    currentElements,
    currentPage,
    isFirst,
    isLast,
    pageSize,
    totalElements,
    totalPages,
  },
  color = 'primary',
  maxPages = 5,
}: PageableProps) => {
  const buttonClass =
    'flex flex-col w-8 h-8 items-center justify-center border-2 rounded-full';
  const navButtonClass = `${buttonClass} ${PageableColor[color].navButton}`;
  const disabledClass = `${buttonClass} ${PageableColor.neutralLight.navButton} ${PageableColor.neutralLight.text} pointer-events-none`;

  const pageButtonClass =
    'flex flex-col w-6 h-6 items-center justify-center rounded-full text-center';
  const defaultPageClass = `${pageButtonClass} hover:underline hover:border ${PageableColor[color].pageButton}`;
  const activePageClass = `${pageButtonClass} shadow-md ${PageableColor[color].activePageButton}`;

  const prevDisabled = isFirst;
  const nextDisabled = isLast;
  const pages: Record<number, number> = Object.fromEntries(
    Array.from({ length: maxPages }, (_, i) => [i + 1, currentPage + i - 2])
  );
  const previousPage = currentPage - 1;
  const nextPage = currentPage + 1;

  const startingElement = currentPage * pageSize;

  return (
    <nav
      aria-label="pagination control"
      className="flex flex-row flex-grow gap-2 justify-between items-center m-2 p-2"
    >
      <div className="flex-1" />
      <div
        className={`flex flex-row gap-2 items-center justify-center ${PageableColor[color].text}`}
      >
        <Link
          to={`?page=${previousPage}`}
          aria-label="previous page"
          className={prevDisabled ? disabledClass : navButtonClass}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5 fill-current stroke-current stroke-0"
          >
            <path
              fillRule="evenodd"
              d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
        {Object.values(pages)
          .filter((page) => page >= 0)
          .filter((page) => page < totalPages)
          .map((page) => (
            <Link
              to={`?page=${page}`}
              key={page}
              aria-label={`page ${page + 1}`}
              className={
                page === currentPage ? activePageClass : defaultPageClass
              }
            >
              {page + 1}
            </Link>
          ))}
        <Link
          to={`?page=${nextPage}`}
          aria-label="next page"
          className={nextDisabled ? disabledClass : navButtonClass}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5 fill-current stroke-current stroke-0"
          >
            <path
              fillRule="evenodd"
              d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>
      <p className="flex-1 text-right text-qxam-neutral-dark-darkest font-light">
        {startingElement + 1}-{startingElement + currentElements} element(s) of{' '}
        {totalElements}
      </p>
    </nav>
  );
};

export default Pageable;
