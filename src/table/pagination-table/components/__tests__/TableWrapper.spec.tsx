import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { stardust } from '@nebula.js/stardust';
import TableWrapper from '../TableWrapper';
import TableBodyWrapper from '../body/TableBodyWrapper';
import TableHeadWrapper from '../head/TableHeadWrapper';
import * as handleKeyPress from '../../../utils/handle-keyboard';
import * as handleScroll from '../../../utils/handle-scroll';
import { TableLayout, TableData, PageInfo, SetPageInfo, Announce, Column } from '../../../../types';
import TestWithProviders from '../../../../__test__/test-with-providers';

describe('<TableWrapper />', () => {
  let tableData: TableData;
  let pageInfo: PageInfo;
  let setPageInfo: SetPageInfo;
  let constraints: stardust.Constraints;
  let rootElement: HTMLElement;
  let rect: stardust.Rect;
  let direction: 'ltr' | 'rtl';
  let announce: Announce;
  let layout: TableLayout;

  const renderTableWrapper = () =>
    render(
      <TestWithProviders
        layout={layout}
        constraints={constraints}
        rootElement={rootElement}
        tableData={tableData}
        rect={rect}
      >
        <TableWrapper pageInfo={pageInfo} setPageInfo={setPageInfo} direction={direction} announce={announce} />
      </TestWithProviders>
    );

  beforeEach(() => {
    // When wrapping a component in memo, the actual functional component is stored on type
    jest.spyOn(TableHeadWrapper, 'type').mockImplementation(() => <thead />);
    jest.spyOn(TableBodyWrapper, 'type').mockImplementation(() => <thead />);

    tableData = {
      totalRowCount: 200,
      totalColumnCount: 10,
      paginationNeeded: true,
      rows: [{ qText: '1' }],
      columns: [{}] as Column[],
      totalsPosition: { atTop: false, atBottom: false },
      totalPages: 2,
    } as unknown as TableData;
    pageInfo = { page: 0, rowsPerPage: 100, rowsPerPageOptions: [10, 25, 100] };
    setPageInfo = jest.fn();
    constraints = {};
    rootElement = {
      getElementsByClassName: () => [],
      getElementsByTagName: () => [{ clientHeight: {}, contains: jest.fn() }],
      querySelector: () => undefined,
    } as unknown as HTMLElement;
    rect = {
      width: 750,
    } as unknown as stardust.Rect;
    window.HTMLElement.prototype.scrollTo = jest.fn();
  });

  afterEach(() => jest.clearAllMocks());

  it('should render table with pagination', () => {
    const { getByLabelText, getByText, getByTestId } = renderTableWrapper();

    expect(
      getByLabelText(`${'SNTable.Accessibility.RowsAndColumns'} ${'SNTable.Accessibility.NavigationInstructions'}`)
    ).toBeVisible();
    expect(getByTestId('table-container').getAttribute('tabindex')).toBe('-1');
    expect(getByTestId('table-container').getAttribute('role')).toBe('application');
    // Just checking that the pagination has rendered, we do more thorough checking in the PaginationContent tests
    expect(getByText('SNTable.Pagination.DisplayedRowsLabel')).toBeVisible();
  });

  it('should not render pagination when constraints.active is true', () => {
    constraints.active = true;
    const { getByLabelText, queryByText, getByTestId } = renderTableWrapper();

    expect(
      getByLabelText(`${'SNTable.Accessibility.RowsAndColumns'} ${'SNTable.Accessibility.NavigationInstructions'}`)
    ).toBeVisible();
    expect(getByTestId('table-container').getAttribute('tabindex')).toBe('-1');
    expect(getByTestId('table-container').getAttribute('role')).toBe('application');
    expect(queryByText('SNTable.Pagination.DisplayedRowsLabel')).toBeNull();
  });

  it('should call handleWrapperKeyDown when press control key on the table', () => {
    jest.spyOn(handleKeyPress, 'handleWrapperKeyDown').mockImplementation(() => jest.fn());
    const { getByLabelText } = renderTableWrapper();

    fireEvent.keyDown(getByLabelText('SNTable.Pagination.RowsPerPage:'), {
      key: 'Control',
      code: 'ControlLeft',
    });
    expect(handleKeyPress.handleWrapperKeyDown).toHaveBeenCalledTimes(1);
  });

  it('should call handleHorizontalScroll when scroll on the table', () => {
    jest.spyOn(handleScroll, 'handleHorizontalScroll').mockImplementation(() => jest.fn());
    const { getByTestId } = renderTableWrapper();

    fireEvent.wheel(getByTestId('table-container'), { deltaX: 100 });
    expect(handleScroll.handleHorizontalScroll).toHaveBeenCalledTimes(1);
  });
});
