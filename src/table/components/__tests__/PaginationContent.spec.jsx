import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import PaginationContent from '../PaginationContent';
import * as handleAccessibility from '../../utils/handle-accessibility';

describe('<PaginationContent />', () => {
  let theme;
  let direction;
  let tableData;
  let pageInfo;
  let setPageInfo;
  let titles;
  let lastPageIdx;
  let handleChangePage;
  let rect;
  let translator;
  let isModal;
  let selectionsAPI;
  let keyboard;
  let constraints;
  let footerContainer;
  let announce;

  const renderPagination = () =>
    render(
      <PaginationContent
        theme={theme}
        direction={direction}
        tableData={tableData}
        pageInfo={pageInfo}
        setPageInfo={setPageInfo}
        keyboard={keyboard}
        translator={translator}
        constraints={constraints}
        footerContainer={footerContainer}
        selectionsAPI={selectionsAPI}
        rect={rect}
        handleChangePage={handleChangePage}
        lastPageIdx={lastPageIdx}
        announce={announce}
      />
    );

  beforeEach(() => {
    theme = {
      table: { pagination: { color: '', iconColor: '' } },
    };
    direction = 'ltr';
    titles = [
      'SNTable.Pagination.FirstPage',
      'SNTable.Pagination.PreviousPage',
      'SNTable.Pagination.NextPage',
      'SNTable.Pagination.LastPage',
    ];
    tableData = {
      totalRowCount: 200,
      totalColumnCount: 5,
      paginationNeeded: true,
    };
    pageInfo = {
      page: 0,
      rowsPerPage: 25,
      rowsPerPageOptions: [10, 25, 100],
    };
    setPageInfo = jest.fn();
    lastPageIdx = 2;
    handleChangePage = jest.fn();
    rect = { width: 700 };
    translator = { get: (s) => s };
    isModal = false;
    selectionsAPI = { isModal: () => isModal };
    keyboard = { enabled: true };
    constraints = {};
    announce = jest.fn();
    jest.spyOn(handleAccessibility, 'focusSelectionToolbar').mockImplementation(() => jest.fn());
  });

  afterEach(() => jest.clearAllMocks());

  describe('rendering', () => {
    it('should return null when paginationNeeded is false', () => {
      tableData.paginationNeeded = false;
      const { queryByText } = renderPagination();
      expect(queryByText('SNTable.Pagination.DisplayedRowsLabel')).toBeNull();
    });

    it('should render all sub-components', () => {
      const { getAllByTestId, queryByTestId, queryByText } = renderPagination();
      const buttons = getAllByTestId('pagination-action-icon-button');

      expect(buttons.length).toBe(4);
      expect(queryByTestId('SelectPage-dropdown')).toBeVisible();
      expect(queryByTestId('RowsPerPage-dropdown')).toBeVisible();
      expect(queryByText('SNTable.Pagination.DisplayedRowsLabel')).toBeVisible();
    });

    it('should render all sub-components except page dropdown', () => {
      rect.width = 600;

      const { getAllByTestId, queryByTestId, queryByText } = renderPagination();
      const buttons = getAllByTestId('pagination-action-icon-button');

      expect(buttons.length).toBe(4);
      expect(queryByTestId('SelectPage-dropdown')).toBeNull();
      expect(queryByTestId('RowsPerPage-dropdown')).toBeVisible();
      expect(queryByText('SNTable.Pagination.DisplayedRowsLabel')).toBeVisible();
    });

    it('should render all sub-components except rpp/page dropdown', () => {
      rect.width = 500;

      const { getAllByTestId, queryByTestId, queryByText } = renderPagination();
      const buttons = getAllByTestId('pagination-action-icon-button');

      expect(buttons.length).toBe(4);
      expect(queryByTestId('SelectPage-dropdown')).toBeNull();
      expect(queryByTestId('RowsPerPage-dropdown')).toBeNull();
      expect(queryByText('SNTable.Pagination.DisplayedRowsLabel')).toBeVisible();
    });
    it('should only render previous/next buttons and current rows info', () => {
      rect.width = 300;

      const { getAllByTestId, queryByTestId, queryByText } = renderPagination();
      const buttons = getAllByTestId('pagination-action-icon-button');

      expect(buttons.length).toBe(2);
      expect(queryByTestId('SelectPage-dropdown')).toBeNull();
      expect(queryByTestId('RowsPerPage-dropdown')).toBeNull();
      expect(queryByText('SNTable.Pagination.DisplayedRowsLabel')).toBeVisible();
    });
    it('should only render previous/next buttons', () => {
      rect.width = 200;

      const { getAllByTestId, queryByTestId, queryByText } = renderPagination();
      const buttons = getAllByTestId('pagination-action-icon-button');

      expect(buttons.length).toBe(2);
      expect(queryByTestId('SelectPage-dropdown')).toBeNull();
      expect(queryByTestId('RowsPerPage-dropdown')).toBeNull();
      expect(queryByText('SNTable.Pagination.DisplayedRowsLabel')).toBeNull();
    });

    it('should render all buttons in right order when left-to-right direction', () => {
      const { getAllByTestId } = renderPagination();

      const renderedNames = getAllByTestId('pagination-action-icon-button');
      renderedNames.forEach((nameNode, index) => {
        expect(Object.values(nameNode)[1].title).toBe(titles[index]);
      });
    });

    it('should render all buttons in right order when right-to-left direction', () => {
      direction = 'rtl';
      const { getAllByTestId } = renderPagination();

      const renderedNames = getAllByTestId('pagination-action-icon-button');
      renderedNames.forEach((nameNode, index) => {
        expect(Object.values(nameNode)[1].title).toBe(titles[index]);
      });
    });
  });

  describe('interaction', () => {
    it('should call handleChangePage when clicking next page', () => {
      const { queryByTitle } = renderPagination();

      fireEvent.click(queryByTitle('SNTable.Pagination.NextPage'));
      expect(handleChangePage).toHaveBeenCalledWith(1);
    });

    it('should call handleChangePage when clicking previous page', () => {
      pageInfo.page = 1;
      const { queryByTitle } = renderPagination();

      fireEvent.click(queryByTitle('SNTable.Pagination.PreviousPage'));
      expect(handleChangePage).toHaveBeenCalledWith(0);
    });

    it('should call handleChangePage when clicking last page', () => {
      const { queryByTitle } = renderPagination();

      fireEvent.click(queryByTitle('SNTable.Pagination.LastPage'));
      expect(handleChangePage).toHaveBeenCalledWith(2);
    });

    it('should call handleChangePage when clicking first page', () => {
      pageInfo.page = 2;
      const { queryByTitle } = renderPagination();

      fireEvent.click(queryByTitle('SNTable.Pagination.FirstPage'));
      expect(handleChangePage).toHaveBeenCalledWith(0);
    });

    it('should not call focusSelectionToolbar when pressing tab on last page button and isInSelectionMode is false', () => {
      const { queryByTitle } = renderPagination();
      fireEvent.keyDown(queryByTitle('SNTable.Pagination.LastPage'), { key: 'Tab' });
      expect(handleAccessibility.focusSelectionToolbar).not.toHaveBeenCalled();
    });

    it('should not call focusSelectionToolbar when pressing shift + tab on last page button and isInSelectionMode is true', () => {
      isModal = true;

      const { queryByTitle } = renderPagination();
      fireEvent.keyDown(queryByTitle('SNTable.Pagination.LastPage'), { key: 'Tab', shiftKey: true });
      expect(handleAccessibility.focusSelectionToolbar).not.toHaveBeenCalled();
    });

    it('should call focusSelectionToolbar when pressing tab on last page button and isInSelectionMode is true', () => {
      isModal = true;

      const { queryByTitle } = renderPagination();
      fireEvent.keyDown(queryByTitle('SNTable.Pagination.LastPage'), { key: 'Tab' });
      expect(handleAccessibility.focusSelectionToolbar).toHaveBeenCalledTimes(1);
    });

    it('should call focusSelectionToolbar when pressing tab on next page button, isInSelectionMode is true and tableWidth < 350', () => {
      isModal = true;
      rect.width = 300;

      const { queryByTitle } = renderPagination();
      fireEvent.keyDown(queryByTitle('SNTable.Pagination.NextPage'), { key: 'Tab' });
      expect(handleAccessibility.focusSelectionToolbar).toHaveBeenCalledTimes(1);
    });

    it('should call handleChangePage when selecting page from dropdown', () => {
      pageInfo.page = 0;
      const { queryByTestId } = renderPagination();

      fireEvent.change(queryByTestId('SelectPage-dropdown'), { target: { value: 1 } });
      expect(handleChangePage).toHaveBeenCalledWith(1);
    });

    it('should call setPageInfo when selecting rows per page from dropdown', () => {
      const targetRowsPerPage = 10;
      const { queryByTestId } = renderPagination();

      fireEvent.change(queryByTestId('RowsPerPage-dropdown'), { target: { value: targetRowsPerPage } });
      expect(setPageInfo).toHaveBeenCalledWith({ ...pageInfo, rowsPerPage: targetRowsPerPage });
      expect(announce).toHaveBeenCalledWith({
        keys: [['SNTable.Pagination.RowsPerPageChange', `${targetRowsPerPage}`]],
        politeness: 'assertive',
      });
    });
  });
});
