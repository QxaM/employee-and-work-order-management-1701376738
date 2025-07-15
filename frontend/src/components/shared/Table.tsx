import { PropsWithChildren } from 'react';

interface TableProps {
  title: string;
}

const Table = ({ title, children }: PropsWithChildren<TableProps>) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="text-xl mx-4 font-semibold">{title}</h2>
      <table className="table-auto border-collapse border border-qxam-secondary-lightest w-full text-left text-qxam-neutral-dark-extreme-dark">
        {children}
      </table>
    </div>
  );
};

interface HeaderProps {
  headerColumns: string[];
}

const TableHeader = ({ headerColumns }: HeaderProps) => {
  const headerCellStyles = 'px-6 py-2 font-semibold';

  return (
    <thead className="bg-qxam-secondary-lightest uppercase">
      <tr>
        {headerColumns.map((column, index) => (
          <th key={`${index} - ${column}`} className={headerCellStyles}>
            {column}
          </th>
        ))}
      </tr>
    </thead>
  );
};

interface TableDataProps {
  rows: {
    data: unknown[];
    onRowClick?: () => void;
  }[];
}

const TableData = ({ rows }: TableDataProps) => {
  const rowStyles = 'hover:bg-qxam-accent-extreme-light cursor-pointer';
  const cellStyles = 'px-6 py-3';

  return (
    <tbody>
      {rows.map((row, index) => (
        <tr
          key={`${index} - ${row.data[0] as string}`}
          className={
            rowStyles +
            ' ' +
            (index % 2 === 1 ? 'bg-qxam-secondary-extreme-light' : '')
          }
          onClick={row.onRowClick}
        >
          {row.data.map((cell, index) => (
            <td key={`${index} - ${cell as string}`} className={cellStyles}>
              {cell as string}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

Table.Header = TableHeader;
Table.Body = TableData;

export default Table;
