import React from 'react';
import { render } from '@testing-library/react';
import TableHeadWrapper from '../TableHeadWrapper';
import { TableData, TableLayout } from '../../../../types';
import TestWithProviders from '../../../../__test__/test-with-providers';

describe('<TableHeadWrapper />', () => {
  let tableData: TableData;
  let layout: TableLayout;
  let areBasicFeaturesEnabled: boolean;

  const renderTableHead = () =>
    render(
      <TestWithProviders layout={layout}>
        <table>
          <TableHeadWrapper tableData={tableData} areBasicFeaturesEnabled={areBasicFeaturesEnabled} />
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
    } as unknown as TableData;
    layout = {
      qHyperCube: {
        qEffectiveInterColumnSortOrder: [0, 1],
      },
    } as TableLayout;
    areBasicFeaturesEnabled = false;
  });

  it('should render table head', () => {
    const { queryByText } = renderTableHead();

    expect(queryByText(tableData.columns[0].label)).toBeVisible();
    expect(queryByText(tableData.columns[1].label)).toBeVisible();
  });

  it('should change`aria-sort` when you sort by second column', () => {
    tableData = {
      columns: [
        { ...tableData.columns[0], sortDirection: 'D' },
        { ...tableData.columns[1], sortDirection: 'A' },
      ],
      totalsPosition: { atTop: false, atBottom: false },
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
