import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import TablePaginationActions from '../TablePaginationActions';
import * as handleAccessibility from '../../utils/handle-accessibility';

describe('<TablePaginationActions />', () => {
  let direction;
  let titles;
  let page;
  let lastPageIdx;
  let onPageChange;
  let tableWidth;
  let translator;
  let isInSelectionMode;
  let keyboard;

  beforeEach(() => {
    direction = 'ltr';
    titles = [
      'SNTable.Pagination.FirstPage',
      'SNTable.Pagination.PreviousPage',
      'SNTable.Pagination.NextPage',
      'SNTable.Pagination.LastPage',
    ];
    page = 0;
    lastPageIdx = 2;
    onPageChange = jest.fn();
    tableWidth = 500;
    translator = { get: (s) => s };
    isInSelectionMode = false;
    keyboard = { enabled: true };
    jest.spyOn(handleAccessibility, 'focusSelectionToolbar').mockImplementation(() => jest.fn());
  });

  afterEach(() => jest.clearAllMocks());

  it('should render all buttons in right order when left-to-right direction', () => {
    const { getAllByTestId } = render(
      <TablePaginationActions
        direction={direction}
        page={page}
        lastPageIdx={lastPageIdx}
        onPageChange={onPageChange}
        tableWidth={tableWidth}
        translator={translator}
        isInSelectionMode={isInSelectionMode}
        keyboard={keyboard}
      />
    );

    const renderedNames = getAllByTestId('pagination-action-icon-button');
    renderedNames.forEach((nameNode, index) => {
      expect(Object.values(nameNode)[1].title).toEqual(titles[index]);
    });
  });

  it('should render all buttons in right order when right-to-left direction', () => {
    direction = 'rtl';
    const { getAllByTestId } = render(
      <TablePaginationActions
        direction={direction}
        page={page}
        lastPageIdx={lastPageIdx}
        onPageChange={onPageChange}
        tableWidth={tableWidth}
        translator={translator}
        isInSelectionMode={isInSelectionMode}
        keyboard={keyboard}
      />
    );

    const renderedNames = getAllByTestId('pagination-action-icon-button');
    renderedNames.forEach((nameNode, index) => {
      expect(Object.values(nameNode)[1].title).toEqual(titles[index]);
    });
  });

  it('should render only previous and next button when the size of table is smaller than or equal to 350', () => {
    tableWidth = 350;
    titles = ['SNTable.Pagination.PreviousPage', 'SNTable.Pagination.NextPage'];
    const { getAllByTestId, queryByTitle } = render(
      <TablePaginationActions
        page={page}
        lastPageIdx={lastPageIdx}
        onPageChange={onPageChange}
        tableWidth={tableWidth}
        translator={translator}
        isInSelectionMode={isInSelectionMode}
        keyboard={keyboard}
      />
    );

    const renderedNames = getAllByTestId('pagination-action-icon-button');
    renderedNames.forEach((nameNode, index) => {
      expect(Object.values(nameNode)[1].title).toEqual(titles[index]);
    });
    expect(queryByTitle('SNTable.Pagination.FirstPage')).toBeNull();
    expect(queryByTitle('SNTable.Pagination.LastPage')).toBeNull();
  });

  it('should render only previous and next button when the size of table is smaller than or equal to 350 and in right-to-left direction', () => {
    tableWidth = 349;
    direction = 'rtl';
    titles = ['SNTable.Pagination.PreviousPage', 'SNTable.Pagination.NextPage'];
    const { queryByTitle, getAllByTestId } = render(
      <TablePaginationActions
        direction={direction}
        page={page}
        lastPageIdx={lastPageIdx}
        onPageChange={onPageChange}
        tableWidth={tableWidth}
        translator={translator}
        isInSelectionMode={isInSelectionMode}
        keyboard={keyboard}
      />
    );

    const renderedNames = getAllByTestId('pagination-action-icon-button');
    renderedNames.forEach((nameNode, index) => {
      expect(Object.values(nameNode)[1].title).toEqual(titles[index]);
    });
    expect(queryByTitle('SNTable.Pagination.FirstPage')).toBeNull();
    expect(queryByTitle('SNTable.Pagination.LastPage')).toBeNull();
  });

  it('should not render pagination dropdown', () => {
    const { queryByTestId } = render(
      <TablePaginationActions
        page={page}
        lastPageIdx={lastPageIdx}
        onPageChange={onPageChange}
        tableWidth={tableWidth}
        translator={translator}
        isInSelectionMode={isInSelectionMode}
        keyboard={keyboard}
      />
    );

    expect(queryByTestId('pagination-dropdown')).toBeNull();
  });

  it('should call onPageChange when clicking next page', () => {
    const { queryByTitle } = render(
      <TablePaginationActions
        page={page}
        lastPageIdx={lastPageIdx}
        onPageChange={onPageChange}
        tableWidth={tableWidth}
        translator={translator}
        isInSelectionMode={isInSelectionMode}
        keyboard={keyboard}
      />
    );

    fireEvent.click(queryByTitle('SNTable.Pagination.NextPage'));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('should call onPageChange when clicking previous page', () => {
    page = 1;
    const { queryByTitle } = render(
      <TablePaginationActions
        page={page}
        lastPageIdx={lastPageIdx}
        onPageChange={onPageChange}
        tableWidth={tableWidth}
        translator={translator}
        isInSelectionMode={isInSelectionMode}
        keyboard={keyboard}
      />
    );

    fireEvent.click(queryByTitle('SNTable.Pagination.PreviousPage'));
    expect(onPageChange).toHaveBeenCalledWith(0);
  });

  it('should call onPageChange when clicking last page', () => {
    const { queryByTitle } = render(
      <TablePaginationActions
        page={page}
        lastPageIdx={lastPageIdx}
        onPageChange={onPageChange}
        tableWidth={tableWidth}
        translator={translator}
        isInSelectionMode={isInSelectionMode}
        keyboard={keyboard}
      />
    );

    fireEvent.click(queryByTitle('SNTable.Pagination.LastPage'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('should call onPageChange when clicking first page', () => {
    page = 2;
    const { queryByTitle } = render(
      <TablePaginationActions
        page={page}
        lastPageIdx={lastPageIdx}
        onPageChange={onPageChange}
        tableWidth={tableWidth}
        translator={translator}
        isInSelectionMode={isInSelectionMode}
        keyboard={keyboard}
      />
    );

    fireEvent.click(queryByTitle('SNTable.Pagination.FirstPage'));
    expect(onPageChange).toHaveBeenCalledWith(0);
  });

  it('should call onPageChange when selecting page from dropdown', () => {
    tableWidth = 700;
    page = 0;
    const { queryByTestId } = render(
      <TablePaginationActions
        page={page}
        lastPageIdx={lastPageIdx}
        onPageChange={onPageChange}
        tableWidth={tableWidth}
        translator={translator}
        isInSelectionMode={isInSelectionMode}
        keyboard={keyboard}
      />
    );

    fireEvent.change(queryByTestId('pagination-dropdown'), { target: { value: 1 } });
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('should not call focusSelectionToolbar when pressing tab on last page button and isInSelectionMode is false', () => {
    const { queryByTitle } = render(
      <TablePaginationActions
        page={page}
        lastPageIdx={lastPageIdx}
        onPageChange={onPageChange}
        tableWidth={tableWidth}
        translator={translator}
        isInSelectionMode={isInSelectionMode}
        keyboard={keyboard}
      />
    );
    fireEvent.keyDown(queryByTitle('SNTable.Pagination.LastPage'), { key: 'Tab' });
    expect(handleAccessibility.focusSelectionToolbar).not.toHaveBeenCalled();
  });

  it('should not call focusSelectionToolbar when pressing shift + tab on last page button and isInSelectionMode is true', () => {
    isInSelectionMode = true;

    const { queryByTitle } = render(
      <TablePaginationActions
        page={page}
        lastPageIdx={lastPageIdx}
        onPageChange={onPageChange}
        tableWidth={tableWidth}
        translator={translator}
        isInSelectionMode={isInSelectionMode}
        keyboard={keyboard}
      />
    );
    fireEvent.keyDown(queryByTitle('SNTable.Pagination.LastPage'), { key: 'Tab', shiftKey: true });
    expect(handleAccessibility.focusSelectionToolbar).not.toHaveBeenCalled();
  });

  it('should call focusSelectionToolbar when pressing tab on last page button and isInSelectionMode is true', () => {
    isInSelectionMode = true;

    const { queryByTitle } = render(
      <TablePaginationActions
        page={page}
        lastPageIdx={lastPageIdx}
        onPageChange={onPageChange}
        tableWidth={tableWidth}
        translator={translator}
        isInSelectionMode={isInSelectionMode}
        keyboard={keyboard}
      />
    );
    fireEvent.keyDown(queryByTitle('SNTable.Pagination.LastPage'), { key: 'Tab' });
    expect(handleAccessibility.focusSelectionToolbar).toHaveBeenCalledTimes(1);
  });

  it('should call focusSelectionToolbar when pressing tab on next page button, isInSelectionMode is true and tableWidth < 350', () => {
    isInSelectionMode = true;
    tableWidth = 300;

    const { queryByTitle } = render(
      <TablePaginationActions
        page={page}
        lastPageIdx={lastPageIdx}
        onPageChange={onPageChange}
        tableWidth={tableWidth}
        translator={translator}
        isInSelectionMode={isInSelectionMode}
        keyboard={keyboard}
      />
    );
    fireEvent.keyDown(queryByTitle('SNTable.Pagination.NextPage'), { key: 'Tab' });
    expect(handleAccessibility.focusSelectionToolbar).toHaveBeenCalledTimes(1);
  });
});
