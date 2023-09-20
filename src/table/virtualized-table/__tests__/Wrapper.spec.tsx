import React from 'react';
import { render, screen } from '@testing-library/react';
import { stardust } from '@nebula.js/stardust';
import Wrapper from '../Wrapper';
import { TableData, TableLayout, ViewService } from '../../../types';
import { TestableTable } from '../Table';
import TestWithProviders from '../../../__test__/test-with-providers';
import { getColumns, getTotalPosition } from '../../../handle-data';
import { EMPTY_TABLE_DATA } from '../../context/TableContext';
import { generateLayout } from '../../../__test__/generate-test-data';

jest.mock('../Table');
jest.mock('@qlik/nebula-table-utils/lib/components', () => ({
  PaginationFooter: jest.fn().mockReturnValue(<div data-testid="footer-wrapper" />),
}));

describe('<Wrapper />', () => {
  let rect: stardust.Rect;
  let layout: TableLayout;
  let viewService: ViewService;
  let tableData: TableData;

  const renderWrapper = () => {
    const mockTable = TestableTable as jest.MockedFunction<typeof TestableTable>;
    mockTable.mockReturnValue(<div data-testid="table-container" />);

    tableData = {
      ...EMPTY_TABLE_DATA,
      paginationNeeded: true,
      columns: getColumns(layout),
      totalsPosition: getTotalPosition(layout, viewService),
    };

    render(
      <TestWithProviders layout={layout} tableData={tableData} rect={rect}>
        <Wrapper />
      </TestWithProviders>
    );
  };

  beforeEach(() => {
    layout = generateLayout(5, 5, 20);
    viewService = {} as ViewService;
    rect = {
      width: 750,
    } as unknown as stardust.Rect;
  });

  afterEach(() => jest.restoreAllMocks());

  it('should render table with pagination', () => {
    renderWrapper();

    expect(screen.getByTestId('table-container')).toBeVisible();
    expect(screen.getByTestId('footer-wrapper')).toBeVisible();
  });
});
