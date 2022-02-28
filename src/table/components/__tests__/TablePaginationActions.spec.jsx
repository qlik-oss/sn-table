import './rtl-setup';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import TablePaginationActions from '../TablePaginationActions';
import * as handleAccessibility from '../../utils/handle-accessibility';

describe('<TablePaginationActions />', () => {
  let theme;
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
    theme = {
      isBackgroundDarkColor: false,
    };
    direction = 'ltr';
    titles = [
      'SNTable.Pagination.FirstPage',
      'SNTable.Pagination.PreviousPage',
      'SNTable.Pagination.NextPage',
      'SNTable.Pagination.LastPage',
    ];
    page = 0;
    lastPageIdx = 2;
    onPageChange = sinon.spy();
    tableWidth = 500;
    translator = { get: (s) => s };
    isInSelectionMode = false;
    keyboard = { enabled: true };
    sinon.stub(handleAccessibility, 'focusSelectionToolbar').returns(sinon.spy());
  });

  afterEach(() => {
    sinon.verifyAndRestore();
    sinon.resetHistory();
  });

  it('should render all buttons in right order when left-to-right direction', () => {
    const { getAllByTestId } = render(
      <TablePaginationActions
        theme={theme}
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
      expect(Object.values(nameNode)[1].title).to.be.equal(titles[index]);
    });
  });

  it('should render all buttons in right order when right-to-left direction', () => {
    direction = 'rtl';
    const { getAllByTestId } = render(
      <TablePaginationActions
        theme={theme}
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
      expect(Object.values(nameNode)[1].title).to.be.equal(titles[index]);
    });
  });

  it('should render only previous and next button when the size of table is smaller than or equal to 350', () => {
    tableWidth = 350;
    titles = ['SNTable.Pagination.PreviousPage', 'SNTable.Pagination.NextPage'];
    const { getAllByTestId, queryByTitle } = render(
      <TablePaginationActions
        theme={theme}
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
      expect(Object.values(nameNode)[1].title).to.be.equal(titles[index]);
    });
    expect(queryByTitle('SNTable.Pagination.FirstPage')).to.be.null;
    expect(queryByTitle('SNTable.Pagination.LastPage')).to.be.null;
  });

  it('should render only previous and next button when the size of table is smaller than or equal to 350 and in right-to-left direction', () => {
    tableWidth = 349;
    direction = 'rtl';
    titles = ['SNTable.Pagination.PreviousPage', 'SNTable.Pagination.NextPage'];
    const { queryByTitle, getAllByTestId } = render(
      <TablePaginationActions
        theme={theme}
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
      expect(Object.values(nameNode)[1].title).to.be.equal(titles[index]);
    });
    expect(queryByTitle('SNTable.Pagination.FirstPage')).to.be.null;
    expect(queryByTitle('SNTable.Pagination.LastPage')).to.be.null;
  });

  it('should not render pagination dropdown', () => {
    const { queryByTestId } = render(
      <TablePaginationActions
        theme={theme}
        page={page}
        lastPageIdx={lastPageIdx}
        onPageChange={onPageChange}
        tableWidth={tableWidth}
        translator={translator}
        isInSelectionMode={isInSelectionMode}
        keyboard={keyboard}
      />
    );

    expect(queryByTestId('pagination-dropdown')).to.be.null;
  });

  it('should call onPageChange when clicking next page', () => {
    const { queryByTitle } = render(
      <TablePaginationActions
        theme={theme}
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
    expect(onPageChange).to.have.been.calledWith(1);
  });

  it('should call onPageChange when clicking previous page', () => {
    page = 1;
    const { queryByTitle } = render(
      <TablePaginationActions
        theme={theme}
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
    expect(onPageChange).to.have.been.calledWith(0);
  });

  it('should call onPageChange when clicking last page', () => {
    const { queryByTitle } = render(
      <TablePaginationActions
        theme={theme}
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
    expect(onPageChange).to.have.been.calledWith(2);
  });

  it('should call onPageChange when clicking first page', () => {
    page = 2;
    const { queryByTitle } = render(
      <TablePaginationActions
        theme={theme}
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
    expect(onPageChange).to.have.been.calledWith(0);
  });

  it('should call onPageChange when selecting page from dropdown', () => {
    tableWidth = 700;
    page = 0;
    const { queryByTestId } = render(
      <TablePaginationActions
        theme={theme}
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
    expect(onPageChange).to.have.been.calledWith(1);
  });

  it('should not call focusSelectionToolbar when pressing tab on last page button and isInSelectionMode is false', () => {
    const { queryByTitle } = render(
      <TablePaginationActions
        theme={theme}
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
    expect(handleAccessibility.focusSelectionToolbar).to.not.have.been.called;
  });

  it('should not call focusSelectionToolbar when pressing shift + tab on last page button and isInSelectionMode is true', () => {
    isInSelectionMode = true;

    const { queryByTitle } = render(
      <TablePaginationActions
        theme={theme}
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
    expect(handleAccessibility.focusSelectionToolbar).to.not.have.been.called;
  });

  it('should call focusSelectionToolbar when pressing tab on last page button and isInSelectionMode is true', () => {
    isInSelectionMode = true;

    const { queryByTitle } = render(
      <TablePaginationActions
        theme={theme}
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
    expect(handleAccessibility.focusSelectionToolbar).to.have.been.calledOnce;
  });

  it('should call focusSelectionToolbar when pressing tab on next page button, isInSelectionMode is true and tableWidth < 350', () => {
    isInSelectionMode = true;
    tableWidth = 300;

    const { queryByTitle } = render(
      <TablePaginationActions
        theme={theme}
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
    expect(handleAccessibility.focusSelectionToolbar).to.have.been.calledOnce;
  });
});
