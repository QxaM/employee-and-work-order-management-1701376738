import { Link } from 'react-router-dom';
import { PageableColor } from '../../../types/PageableTypes.ts';
import { Color } from '../../../types/TailwindTypes.ts';
import clsx from 'clsx/lite';
import { Flex, Text } from '@radix-ui/themes';

interface PageButtonProps {
  toPage: number;
  currentPage: number;
  color: Color;
}

const PageButton = ({ toPage, currentPage, color }: PageButtonProps) => {
  const oneBasedPage = toPage + 1;
  const isActive = toPage === currentPage;

  const pageButtonClass = clsx(
    'rounded-full text-center',
    isActive
      ? `shadow-md ${PageableColor[color].activePageButton}`
      : PageableColor[color].pageButton
  );

  return (
    <Link
      to={`?page=${toPage}`}
      key={toPage}
      aria-label={`page ${oneBasedPage}`}
      className={pageButtonClass}
    >
      <Flex
        direction="column"
        justify="center"
        align="center"
        className="size-(--font-size-7)"
      >
        <Text>{oneBasedPage}</Text>
      </Flex>
    </Link>
  );
};

export default PageButton;
