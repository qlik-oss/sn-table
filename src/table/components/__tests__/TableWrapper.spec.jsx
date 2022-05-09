import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import TableWrapper from '../TableWrapper';
import * as TableBodyWrapper from '../TableBodyWrapper';
import * as TableHeadWrapper from '../TableHeadWrapper';
import * as handleKeyPress from '../../utils/handle-key-press';

describe('<TableWrapper />', () => {
  let tableData;
  let pageInfo;
  let setPageInfo;
  let constraints;
  let rowsPerPage;
  let selectionsAPI;
  let modal;
  let rootElement;
  let keyboard;
  let translator;
  let rect;
  let announcer;
  let theme;

  beforeEach(() => {
    jest.spyOn(TableBodyWrapper, 'default').mockImplementation(() => <tbody />);
    jest.spyOn(TableHeadWrapper, 'default').mockImplementation(() => <thead />);
    jest.spyOn(handleKeyPress, 'handleTableWrapperKeyDown').mockImplementation(() => jest.fn());

    tableData = {
      totalRowCount: 200,
      paginationNeeded: true,
      rows: [{ qText: '1' }],
      columns: [{}],
    };
    pageInfo = { page: 0, rowsPerPage: 100 };
    setPageInfo = jest.fn();
    constraints = {};
    rowsPerPage = 100;
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
      width: 551,
    };
    announcer = jest.fn();
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

  it('should render table', () => {
    const { queryByLabelText, queryByText, queryByTestId } = render(
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

    expect(
      queryByLabelText(`${'SNTable.Accessibility.RowsAndColumns'} ${'SNTable.Accessibility.NavigationInstructions'}`)
    ).toBeVisible();
    expect(queryByLabelText('SNTable.Pagination.RowsPerPage')).toBeVisible();
    expect(queryByTestId('table-container').getAttribute('tabindex')).toBe('-1');
    expect(queryByTestId('table-container').getAttribute('role')).toBe('application');
    expect(queryByText('SNTable.Pagination.DisplayedRowsLabel')).toBeVisible();
    expect(queryByText(rowsPerPage)).toBeVisible();
  });

  it('should call handleTableWrapperKeyDown when press control key on the table', () => {
    const { queryByLabelText } = render(
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

    fireEvent.keyDown(queryByLabelText('SNTable.Pagination.RowsPerPage'), { key: 'Control', code: 'ControlLeft' });
    expect(handleKeyPress.handleTableWrapperKeyDown).toHaveBeenCalledTimes(1);
  });

  it('should call setPageInfo when changing rows per page', () => {
    const targetRowsPerPage = 25;
    const { getByTestId } = render(
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
        announcer={announcer}
        theme={theme}
      />
    );

    fireEvent.change(getByTestId('select'), { target: { value: targetRowsPerPage } });

    expect(setPageInfo).toHaveBeenCalledWith({ page: 0, rowsPerPage: targetRowsPerPage });
    expect(announcer).toHaveBeenCalledWith({
      keys: [['SNTable.Pagination.RowsPerPageChange', `${targetRowsPerPage}`]],
      politeness: 'assertive',
    });
  });

  it('should call setPageInfo when changing page', () => {
    rect = {
      width: 651,
    };
    const { getByTestId } = render(
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
        announcer={announcer}
        theme={theme}
      />
    );

    fireEvent.change(getByTestId('pagination-dropdown'));

    expect(setPageInfo).toHaveBeenCalledTimes(1);
    expect(announcer).toHaveBeenCalledWith({
      keys: [['SNTable.Pagination.PageStatusReport', [1, 2]]], // 200 rows, 100 rows per page => [1, 2]
      politeness: 'assertive',
    });
  });

  it('should not render rows per page section in table when width smaller than 550', () => {
    rect = {
      width: 474,
    };
    const { queryByLabelText } = render(
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

    expect(queryByLabelText('SNTable.RowsPerPage')).toBeNull();
  });

  it('should not show rows per page when selectionsAPI.isModal() returns true', () => {
    modal = true;

    const { queryByText } = render(
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
    const rppSiblingElement = queryByText(`SNTable.Pagination.DisplayedRowsLabel`);

    // Can't check if rows per page is not visible, so check if parent has correct amount of child elements
    expect(rppSiblingElement.parentNode.childElementCount).toBe(3);
  });
});
