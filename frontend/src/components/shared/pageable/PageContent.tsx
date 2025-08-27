import { Text } from '@radix-ui/themes';

interface PageContentProps {
  startElement: number;
  currentElements: number;
  totalElements: number;
}

const PageContent = ({
  startElement,
  currentElements,
  totalElements,
}: PageContentProps) => {
  return (
    <Text weight="light" className="flex-1 text-right">
      {startElement + 1} - {startElement + currentElements} element(s) of{' '}
      {totalElements}
    </Text>
  );
};

export default PageContent;
