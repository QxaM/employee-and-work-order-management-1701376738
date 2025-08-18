import { Color } from '../../../types/TailwindTypes.ts';
import {
  Pageable as PageableData,
  PageableColor,
} from '../../../types/PageableTypes.ts';
import { Flex } from '@radix-ui/themes';
import clsx from 'clsx/lite';
import PageableNavButton from './PageableNavButton.tsx';
import PageButton from './PageButton.tsx';
import PageContent from './PageContent.tsx';

interface PageableProps {
  pageable: PageableData;
  color?: Exclude<Color, 'gray'>;
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
  color = 'violet',
  maxPages = 5,
}: PageableProps) => {
  const flexWrapperClasses = clsx(PageableColor[color].text);

  const pages: Record<number, number> = Object.fromEntries(
    Array.from({ length: maxPages }, (_, i) => [i + 1, currentPage + i - 2])
  );

  const startingElement = currentPage * pageSize;

  return (
    <nav aria-label="pagination control" role="navigation">
      <Flex gap="2" justify="between" align="center" className="w-full">
        <div className="flex-1" />
        <Flex
          gap="2"
          align="center"
          justify="center"
          className={flexWrapperClasses}
        >
          <PageableNavButton
            direction="previous"
            currentPage={currentPage}
            isDisabled={isFirst}
            color={color}
          />
          {Object.values(pages)
            .filter((page) => page >= 0)
            .filter((page) => page < totalPages)
            .map((page) => (
              <PageButton
                key={page}
                toPage={page}
                currentPage={currentPage}
                color={color}
              />
            ))}
          <PageableNavButton
            direction="next"
            currentPage={currentPage}
            isDisabled={isLast}
            color={color}
          />
        </Flex>
        <PageContent
          startElement={startingElement}
          currentElements={currentElements}
          totalElements={totalElements}
        />
      </Flex>
    </nav>
  );
};

export default Pageable;
