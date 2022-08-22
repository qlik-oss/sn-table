import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { stardust } from '@nebula.js/stardust';

import PaginationContent from '../PaginationContent';
import * as handleAccessibility from '../../utils/handle-accessibility';
import { Announce, ExtendedTheme, ExtendedTranslator, PageInfo, SetPageInfo, TableData } from '../../../types';

describe('<PaginationContent />', () => {
  let theme: ExtendedTheme;
  let direction: 'ltr' | 'rtl' | undefined;
  let tableData: TableData;
  let pageInfo: PageInfo;
  let setPageInfo: SetPageInfo;
  let titles: string[];
  let handleChangePage: () => void;
  let rect: stardust.Rect;
  let translator: ExtendedTranslator;
  let isSelectionMode: boolean;
  let keyboard: stardust.Keyboard;
  let constraints: stardust.Constraints;
  let footerContainer: HTMLElement;
  let announce: Announce;

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
        isSelectionMode={isSelectionMode}
        rect={rect}
        handleChangePage={handleChangePage}
        announce={announce}
      />
    );

  beforeEach(() => {
    theme = {
      table: { pagination: { color: '', iconColor: '' } },
    } as unknown as ExtendedTheme;
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
      totalPages: 3,
    } as unknown as TableData;
    pageInfo = {
      page: 0,
      rowsPerPage: 25,
      rowsPerPageOptions: [10, 25, 100],
    };
    setPageInfo = jest.fn();
    handleChangePage = jest.fn();
    rect = { width: 750 } as unknown as stardust.Rect;
    translator = { get: (s) => s } as unknown as ExtendedTranslator;
    isSelectionMode = false;
    keyboard = { enabled: true } as unknown as stardust.Keyboard;
    constraints = {};
    announce = jest.fn();
    jest.spyOn(handleAccessibility, 'focusSelectionToolbar').mockImplementation(() => jest.fn());
  });

  afterEach(() => jest.clearAllMocks());

  describe('rendering', () => {
    it('should return null when paginationNeeded is false', () => {
      tableData.paginationNeeded = false;
      const { getByText } = renderPagination();
      expect(getByText('SNTable.Pagination.DisplayedRowsLabel')).toBeNull();
    });

    it('should render all sub-components', () => {
      const { getAllByTestId, queryByTestId, queryByText } = renderPagination();
      const buttons = getAllByTestId('pagination-action-icon-button');

      expect(buttons).toHaveLength(4);
      expect(queryByTestId('SelectPage-dropdown')).toBeVisible();
      expect(queryByTestId('RowsPerPage-dropdown')).toBeVisible();
      expect(queryByText('SNTable.Pagination.DisplayedRowsLabel')).toBeVisible();
    });

    it('should render all sub-components except page dropdown', () => {
      rect.width = 600;

      const { getAllByTestId, queryByTestId, queryByText } = renderPagination();
      const buttons = getAllByTestId('pagination-action-icon-button');

      expect(buttons).toHaveLength(4);
      expect(queryByTestId('SelectPage-dropdown')).toBeNull();
      expect(queryByTestId('RowsPerPage-dropdown')).toBeVisible();
      expect(queryByText('SNTable.Pagination.DisplayedRowsLabel')).toBeVisible();
    });

    it('should render all sub-components except rpp/page dropdown', () => {
      rect.width = 500;

      const { getAllByTestId, queryByTestId, queryByText } = renderPagination();
      const buttons = getAllByTestId('pagination-action-icon-button');

      expect(buttons).toHaveLength(4);
      expect(queryByTestId('SelectPage-dropdown')).toBeNull();
      expect(queryByTestId('RowsPerPage-dropdown')).toBeNull();
      expect(queryByText('SNTable.Pagination.DisplayedRowsLabel')).toBeVisible();
    });
    it('should only render previous/next buttons and current rows info', () => {
      rect.width = 300;

      const { getAllByTestId, queryByTestId, queryByText } = renderPagination();
      const buttons = getAllByTestId('pagination-action-icon-button');

      expect(buttons).toHaveLength(2);
      expect(queryByTestId('SelectPage-dropdown')).toBeNull();
      expect(queryByTestId('RowsPerPage-dropdown')).toBeNull();
      expect(queryByText('SNTable.Pagination.DisplayedRowsLabel')).toBeVisible();
    });
    it('should only render previous/next buttons', () => {
      rect.width = 200;

      const { getAllByTestId, queryByTestId, queryByText } = renderPagination();
      const buttons = getAllByTestId('pagination-action-icon-button');

      expect(buttons).toHaveLength(2);
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

      fireEvent.click(queryByTitle('SNTable.Pagination.NextPage') as HTMLElement);
      expect(handleChangePage).toHaveBeenCalledWith(1);
    });

    it('should call handleChangePage when clicking previous page', () => {
      pageInfo.page = 1;
      const { queryByTitle } = renderPagination();

      fireEvent.click(queryByTitle('SNTable.Pagination.PreviousPage') as HTMLElement);
      expect(handleChangePage).toHaveBeenCalledWith(0);
    });

    it('should call handleChangePage when clicking last page', () => {
      const { queryByTitle } = renderPagination();

      fireEvent.click(queryByTitle('SNTable.Pagination.LastPage') as HTMLElement);
      expect(handleChangePage).toHaveBeenCalledWith(2);
    });

    it('should call handleChangePage when clicking first page', () => {
      pageInfo.page = 2;
      const { queryByTitle } = renderPagination();

      fireEvent.click(queryByTitle('SNTable.Pagination.FirstPage') as HTMLElement);
      expect(handleChangePage).toHaveBeenCalledWith(0);
    });

    it('should not call focusSelectionToolbar when pressing tab on last page button and isSelectionMode is false', () => {
      const { queryByTitle } = renderPagination();
      fireEvent.keyDown(queryByTitle('SNTable.Pagination.LastPage') as HTMLElement, { key: 'Tab' });
      expect(handleAccessibility.focusSelectionToolbar).not.toHaveBeenCalled();
    });

    it('should not call focusSelectionToolbar when pressing shift + tab on last page button and isSelectionMode is true', () => {
      isSelectionMode = true;

      const { queryByTitle } = renderPagination();
      fireEvent.keyDown(queryByTitle('SNTable.Pagination.LastPage') as HTMLElement, { key: 'Tab', shiftKey: true });
      expect(handleAccessibility.focusSelectionToolbar).not.toHaveBeenCalled();
    });

    it('should call focusSelectionToolbar when pressing tab on last page button and isSelectionMode is true', () => {
      isSelectionMode = true;

      const { queryByTitle } = renderPagination();
      fireEvent.keyDown(queryByTitle('SNTable.Pagination.LastPage') as HTMLElement, { key: 'Tab' });
      expect(handleAccessibility.focusSelectionToolbar).toHaveBeenCalledTimes(1);
    });

    it('should call focusSelectionToolbar when pressing tab on next page button, isSelectionMode is true and tableWidth < 350', () => {
      isSelectionMode = true;
      rect.width = 300;

      const { queryByTitle } = renderPagination();
      fireEvent.keyDown(queryByTitle('SNTable.Pagination.NextPage') as HTMLElement, { key: 'Tab' });
      expect(handleAccessibility.focusSelectionToolbar).toHaveBeenCalledTimes(1);
    });

    it('should call handleChangePage when selecting page from dropdown', () => {
      pageInfo.page = 0;
      const { queryByTestId } = renderPagination();

      fireEvent.change(queryByTestId('SelectPage-dropdown') as HTMLElement, { target: { value: 1 } });
      expect(handleChangePage).toHaveBeenCalledWith(1);
    });

    it('should call setPageInfo when selecting rows per page from dropdown', () => {
      const targetRowsPerPage = 10;
      const { queryByTestId } = renderPagination();

      fireEvent.change(queryByTestId('RowsPerPage-dropdown') as HTMLElement, { target: { value: targetRowsPerPage } });
      expect(setPageInfo).toHaveBeenCalledWith({ ...pageInfo, rowsPerPage: targetRowsPerPage });
      expect(announce).toHaveBeenCalledWith({
        keys: [['SNTable.Pagination.RowsPerPageChange', `${targetRowsPerPage}`]],
        politeness: 'assertive',
      });
    });
  });
});
