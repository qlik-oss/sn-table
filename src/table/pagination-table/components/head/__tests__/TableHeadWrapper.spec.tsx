import React from 'react';
import { render } from '@testing-library/react';
import TableHeadWrapper from '../TableHeadWrapper';
import { TableData, TableLayout } from '../../../../../types';
import TestWithProviders from '../../../../../__test__/test-with-providers';

describe('<TableHeadWrapper />', () => {
  let tableData: TableData;
  let layout: TableLayout;

  const renderTableHead = () =>
    render(
      <TestWithProviders layout={layout} tableData={tableData}>
        <table>
          <TableHeadWrapper />
        </table>
      </TestWithProviders>
    );

  beforeEach(() => {
    tableData = {
      columns: [
        {
          id: 1,
          align: 'left',
          label: 'someDim',
          sortDirection: 'A',
          isDim: true,
          isLocked: false,
          colIdx: 0,
          qReverseSort: false,
        },
        { id: 2, align: 'right', label: 'someMsr', sortDirection: 'D', isDim: false, colIdx: 1, qReverseSort: false },
      ],
      totalsPosition: { atTop: false, atBottom: false },
      rows: [{ qText: '1' }],
    } as unknown as TableData;
    layout = {
      qHyperCube: {
        qEffectiveInterColumnSortOrder: [0, 1],
      },
    } as TableLayout;
  });

  it('should render table head', () => {
    const { queryByText, getByText } = renderTableHead();

    expect(queryByText(tableData.columns[0].label)).toBeVisible();
    expect(queryByText(tableData.columns[1].label)).toBeVisible();

    const firstColumn = getByText(tableData.columns[0].label).closest('th') as HTMLTableCellElement;
    const secondColumn = getByText(tableData.columns[1].label).closest('th') as HTMLTableCellElement;
    expect(firstColumn.getAttribute('scope')).toBe('col');
    expect(secondColumn.getAttribute('scope')).toBe('col');
    expect(firstColumn.getAttribute('aria-sort')).toBe('ascending');
    expect(secondColumn.getAttribute('aria-sort')).toBeNull();
  });

  it('should change`aria-sort` when you sort by second column', () => {
    tableData = {
      columns: [
        { ...tableData.columns[0], sortDirection: 'D' },
        { ...tableData.columns[1], sortDirection: 'A' },
      ],
      totalsPosition: { atTop: false, atBottom: false },
      rows: [{ qText: '1' }],
    } as unknown as TableData;
    layout = {
      qHyperCube: {
        qEffectiveInterColumnSortOrder: [1, 0],
      },
    } as TableLayout;

    const { getByText } = renderTableHead();
    const firstColQuery = getByText(tableData.columns[0].label).closest('th') as HTMLTableCellElement;
    const secondColQuery = getByText(tableData.columns[1].label).closest('th') as HTMLTableCellElement;

    expect(firstColQuery.getAttribute('aria-sort')).toBeNull();
    expect(secondColQuery.getAttribute('aria-sort')).toBe('ascending');
  });
});
