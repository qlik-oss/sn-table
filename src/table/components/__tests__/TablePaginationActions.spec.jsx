import './rtl-setup';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import TablePaginationActions from '../TablePaginationActions';
import * as handleAccessibility from '../../utils/handle-accessibility';

describe('<TablePaginationActions />', () => {
  let page;
  let lastPage;
  let onPageChange;
  let tableWidth;
  let translator;
  let isInSelectionMode;
  let keyboard;

  beforeEach(() => {
    page = 0;
    lastPage = 2;
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

  it('should render all buttons', () => {
    const { queryByTitle } = render(
      <TablePaginationActions
        page={page}
        lastPage={lastPage}
        onPageChange={onPageChange}
        tableWidth={tableWidth}
        translator={translator}
        isInSelectionMode={isInSelectionMode}
        keyboard={keyboard}
      />
    );

    expect(queryByTitle('SNTable.Pagination.FirstPage')).to.be.visible;
    expect(queryByTitle('SNTable.Pagination.PreviousPage')).to.be.visible;
    expect(queryByTitle('SNTable.Pagination.NextPage')).to.be.visible;
    expect(queryByTitle('SNTable.Pagination.LastPage')).to.be.visible;
  });

  it('should render only previous and next button', () => {
    tableWidth = 300;
    const { queryByTitle } = render(
      <TablePaginationActions
        page={page}
        lastPage={lastPage}
        onPageChange={onPageChange}
        tableWidth={tableWidth}
        translator={translator}
        isInSelectionMode={isInSelectionMode}
        keyboard={keyboard}
      />
    );

    expect(queryByTitle('SNTable.Pagination.FirstPage')).to.be.null;
    expect(queryByTitle('SNTable.Pagination.PreviousPage')).to.be.visible;
    expect(queryByTitle('SNTable.Pagination.NextPage')).to.be.visible;
    expect(queryByTitle('SNTable.Pagination.LastPage')).to.be.null;
  });

  it('should not render pagination dropdown', () => {
    const { queryByTitle, queryByTestId } = render(
      <TablePaginationActions
        page={page}
        lastPage={lastPage}
        onPageChange={onPageChange}
        tableWidth={tableWidth}
        translator={translator}
        isInSelectionMode={isInSelectionMode}
        keyboard={keyboard}
      />
    );

    expect(queryByTitle('SNTable.Pagination.FirstPage')).to.be.visible;
    expect(queryByTitle('SNTable.Pagination.PreviousPage')).to.be.visible;
    expect(queryByTitle('SNTable.Pagination.NextPage')).to.be.visible;
    expect(queryByTitle('SNTable.Pagination.LastPage')).to.be.visible;
    expect(queryByTestId('pagination-dropdown')).to.be.null;
  });

  it('should call onPageChange when clicking next page', () => {
    const { queryByTitle } = render(
      <TablePaginationActions
        page={page}
        lastPage={lastPage}
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
        page={page}
        lastPage={lastPage}
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
        page={page}
        lastPage={lastPage}
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
        page={page}
        lastPage={lastPage}
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
        page={page}
        lastPage={lastPage}
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
        page={page}
        lastPage={lastPage}
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
        page={page}
        lastPage={lastPage}
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
        page={page}
        lastPage={lastPage}
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
        page={page}
        lastPage={lastPage}
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
