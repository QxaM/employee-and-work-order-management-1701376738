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
      {
        data: ['Test data 1', 'Test data 2'],
        onRowClick: vi.fn(),
      },
      {
        data: ['Test data 3', 'Test data 4'],
        onRowClick: vi.fn(),
      },
    ];

    render(
      <Table title="Test title">
        <Table.Body rows={dataRows} />
      </Table>
    );

    // When
    const dataCell1 = screen.getByRole('cell', { name: dataRows[0].data[0] });
    const dataCell2 = screen.getByRole('cell', { name: dataRows[0].data[1] });
    const dataCell3 = screen.getByRole('cell', { name: dataRows[1].data[0] });
    const dataCell4 = screen.getByRole('cell', { name: dataRows[1].data[1] });

    // Then
    expect(dataCell1).toBeInTheDocument();
    expect(dataCell2).toBeInTheDocument();
    expect(dataCell3).toBeInTheDocument();
    expect(dataCell4).toBeInTheDocument();
  });

  it('Should pass onClickRow function', () => {
    // Given
    const mockOnclick = vi.fn();
    const dataRows = [
      {
        data: ['Test data 1', 'Test data 2'],
        onRowClick: mockOnclick,
      },
      {
        data: ['Test data 3', 'Test data 4'],
        onRowClick: mockOnclick,
      },
    ];

    render(
      <Table title="Test title">
        <Table.Body rows={dataRows} />
      </Table>
    );
    const dataCell1 = screen.getByRole('cell', { name: dataRows[0].data[0] });
    const dataRow1 = dataCell1.parentElement;

    const dataCell2 = screen.getByRole('cell', { name: dataRows[0].data[1] });
    const dataRow2 = dataCell2.parentElement;

    // When
    if (dataRow1) {
      dataRow1.click();
    }
    if (dataRow2) {
      dataRow2.click();
    }

    // Then
    expect(mockOnclick).toHaveBeenCalledTimes(2);
  });
});
