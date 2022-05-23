import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import * as TableWrapper from '../TableWrapper';
import * as TableBodyWrapper from '../TableBodyWrapper';
import * as TableHeadWrapper from '../TableHeadWrapper';
import * as handleKeyPress from '../../utils/handle-key-press';

describe('<TableWrapper />', () => {
  let tableData;
  let pageInfo;
  let setPageInfo;
  let constraints;
  let selectionsAPI;
  let modal;
  let rootElement;
  let keyboard;
  let translator;
  let rect;
  let theme;

  const renderTableWrapper = () =>
    render(
      <TableWrapper
        tableData={tableData}
        pageInfo={pageInfo}
        setPageInfo={setPageInfo}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        rootElement={rootElement}
        keyboard={keyboard}
        translator={translator}
        rect={rect}
        theme={theme}
      />
    );

  beforeEach(() => {
    jest.spyOn(TableBodyWrapper, 'default').mockImplementation(() => <tbody />);
    jest.spyOn(TableHeadWrapper, 'default').mockImplementation(() => <thead />);
    jest.spyOn(handleKeyPress, 'handleTableWrapperKeyDown').mockImplementation(() => jest.fn());

    tableData = {
      totalRowCount: 200,
      totalColumnCount: 10,
      paginationNeeded: true,
      rows: [{ qText: '1' }],
      columns: [{}],
    };
    pageInfo = { page: 0, rowsPerPage: 100, rowsPerPageOptions: [10, 25, 100] };
    setPageInfo = jest.fn();
    constraints = {};
    selectionsAPI = {
      isModal: () => modal,
    };
    modal = false;
    rootElement = {
      getElementsByClassName: () => [],
      getElementsByTagName: () => [{ clientHeight: {}, contains: jest.fn() }],
      querySelector: () => {},
    };
    keyboard = { enabled: false, active: false };
    translator = { get: (s) => s };
    rect = {
      width: 750,
    };
    theme = {
      getStyle: () => {},
      table: {
        body: {
          borderColor: '',
        },
        pagination: {
          borderColor: '',
        },
      },
    };
  });

  afterEach(() => jest.clearAllMocks());

  it('should render table with pagination', () => {
    const { queryByLabelText, queryByText, queryByTestId } = renderTableWrapper();

    expect(
      queryByLabelText(`${'SNTable.Accessibility.RowsAndColumns'} ${'SNTable.Accessibility.NavigationInstructions'}`)
    ).toBeVisible();
    expect(queryByTestId('table-container').getAttribute('tabindex')).toBe('-1');
    expect(queryByTestId('table-container').getAttribute('role')).toBe('application');
    // Just checking that the pagination has rendered, we do more thorough checking in the PaginationContent tests
    expect(queryByText('SNTable.Pagination.DisplayedRowsLabel')).toBeVisible();
  });

  it('should not render pagination when constraints.active is true', () => {
    constraints.active = true;
    const { queryByLabelText, queryByText, queryByTestId } = renderTableWrapper();

    expect(
      queryByLabelText(`${'SNTable.Accessibility.RowsAndColumns'} ${'SNTable.Accessibility.NavigationInstructions'}`)
    ).toBeVisible();
    expect(queryByTestId('table-container').getAttribute('tabindex')).toBe('-1');
    expect(queryByTestId('table-container').getAttribute('role')).toBe('application');
    expect(queryByText('SNTable.Pagination.DisplayedRowsLabel')).toBeNull();
  });

  it('should call handleTableWrapperKeyDown when press control key on the table', () => {
    const { queryByLabelText } = renderTableWrapper();

    fireEvent.keyDown(queryByLabelText('SNTable.Pagination.RowsPerPage:'), { key: 'Control', code: 'ControlLeft' });
    expect(handleKeyPress.handleTableWrapperKeyDown).toHaveBeenCalledTimes(1);
  });
});
