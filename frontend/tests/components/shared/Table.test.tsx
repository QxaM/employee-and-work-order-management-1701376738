import { describe } from 'vitest';
import { render, screen } from '@testing-library/react';

import Table from '../../../src/components/shared/Table.tsx';

describe('Table', () => {
  it('Should render table title', () => {
    // Given
    const title = 'Test title';

    render(<Table title={title} />);

    // When
    const titleElement = screen.getByText(title, { exact: true });

    // Then
    expect(titleElement).toBeInTheDocument();
  });

  it('Should render table header row correctly', () => {
    // Given
    const headerRow = ['Test header 1', 'Test header 2'];

    render(
      <Table title="Test title">
        <Table.Header headerColumns={headerRow} />
      </Table>
    );

    // When
    const headerCell1 = screen.getByRole('columnheader', {
      name: headerRow[0],
    });
    const headerCell2 = screen.getByRole('columnheader', {
      name: headerRow[1],
    });

    // Then
    expect(headerCell1).toBeInTheDocument();
    expect(headerCell2).toBeInTheDocument();
  });

  it('Should render data rows correctly', () => {
    // Given
    const dataRows = [
      ['Test data 1', 'Test data 2'],
      ['Test data 3', 'Test data 4'],
    ];

    render(
      <Table title="Test title">
        <Table.Body data={dataRows} />
      </Table>
    );

    // When
    const dataCell1 = screen.getByRole('cell', { name: dataRows[0][0] });
    const dataCell2 = screen.getByRole('cell', { name: dataRows[0][1] });
    const dataCell3 = screen.getByRole('cell', { name: dataRows[1][0] });
    const dataCell4 = screen.getByRole('cell', { name: dataRows[1][1] });

    // Then
    expect(dataCell1).toBeInTheDocument();
    expect(dataCell2).toBeInTheDocument();
    expect(dataCell3).toBeInTheDocument();
    expect(dataCell4).toBeInTheDocument();
  });
});
