import { PropsWithChildren } from 'react';
import { Flex, Heading, Table as RadixTable, Text } from '@radix-ui/themes';
import clsx from 'clsx/lite';

interface TableProps {
  title: string;
  description: string;
}

/**
 * A functional component that represents a table, which includes a title and renders its children within a styled table layout.
 *
 * @param {object} props - The properties object.
 * @param {string} props.title - The title to be displayed above the table.
 * @param {React.ReactNode} props.children - The content to be rendered inside the table.
 */
const Table = ({
  title,
  description,
  children,
}: PropsWithChildren<TableProps>) => {
  return (
    <Flex direction="column" gap="6" width="100%">
      <Flex direction="column" gap="1" mx="2">
        <Heading as="h2" weight="medium">
          {title}
        </Heading>
        <Text as="p" size="2">
          {description}
        </Text>
      </Flex>
      <RadixTable.Root variant="surface" layout="auto" size="2">
        {children}
      </RadixTable.Root>
    </Flex>
  );
};

interface HeaderProps {
  headerColumns: string[];
}

const TableHeader = ({ headerColumns }: HeaderProps) => {
  return (
    <RadixTable.Header>
      <RadixTable.Row>
        {headerColumns.map((column, index) => (
          <RadixTable.ColumnHeaderCell key={`${index} - ${column}`}>
            {column}
          </RadixTable.ColumnHeaderCell>
        ))}
      </RadixTable.Row>
    </RadixTable.Header>
  );
};

interface TableDataProps {
  rows: {
    data: unknown[];
    onRowClick?: () => void;
  }[];
}

const TableData = ({ rows }: TableDataProps) => {
  const getRowClass = (row: (typeof rows)[0]) => {
    return clsx(row.onRowClick && 'cursor-pointer hover:bg-(--accent-2)');
  };

  return (
    <RadixTable.Body>
      {rows.map((row, index) => (
        <RadixTable.Row
          key={`${index} - ${row.data[0] as string}`}
          className={getRowClass(row)}
          onClick={row.onRowClick}
        >
          {row.data.map((cell, index) => (
            <RadixTable.Cell key={`${index} - ${cell as string}`}>
              {cell as string}
            </RadixTable.Cell>
          ))}
        </RadixTable.Row>
      ))}
    </RadixTable.Body>
  );
};

Table.Header = TableHeader;
Table.Body = TableData;

export default Table;
