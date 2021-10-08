import './rtl-setup';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import TablePaginationActions from '../TablePaginationActions';
import * as handleCellFocus from '../cells/handle-cell-focus';

describe('<TablePaginationActions />', () => {
  let count;
  let page;
  let rowsPerPage;
  let onPageChange;
  let keyboardActive;
  let tableWidth;
  let translator;
  let isInSelectionMode;

  beforeEach(() => {
    count = 250;
    page = 0;
    rowsPerPage = 100;
    onPageChange = sinon.spy();
    keyboardActive = false;
    tableWidth = 500;
    translator = { get: (s) => s };
    isInSelectionMode = false;
    sinon.stub(handleCellFocus, 'focusConfirmButton').returns(sinon.spy());
  });

  afterEach(() => {
    sinon.verifyAndRestore();
    sinon.resetHistory();
  });

  it('should render all buttons', () => {
    const { queryByTitle } = render(
      <TablePaginationActions
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        keyboardActive={keyboardActive}
        tableWidth={tableWidth}
        translator={translator}
        isInSelectionMode={isInSelectionMode}
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
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        keyboardActive={keyboardActive}
        tableWidth={tableWidth}
        translator={translator}
        isInSelectionMode={isInSelectionMode}
      />
    );

    expect(queryByTitle('SNTable.Pagination.FirstPage')).to.be.null;
    expect(queryByTitle('SNTable.Pagination.PreviousPage')).to.be.visible;
    expect(queryByTitle('SNTable.Pagination.NextPage')).to.be.visible;
    expect(queryByTitle('SNTable.Pagination.LastPage')).to.be.null;
  });

  it.skip('should call onPageChange when clicking next page and previous page button', () => {
    const { queryByTitle } = render(
      <TablePaginationActions
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        keyboardActive={keyboardActive}
        tableWidth={tableWidth}
        translator={translator}
        isInSelectionMode={isInSelectionMode}
      />
    );

    fireEvent.click(queryByTitle('SNTable.Pagination.NextPage'));
    expect(onPageChange).to.have.been.calledWith(sinon.match.any, 1);

    fireEvent.click(queryByTitle('SNTable.Pagination.PreviousPage'));
    expect(onPageChange).to.have.been.calledWith(sinon.match.any, 0);
  });

  it.skip('should call onPageChange when clicking last page and first page button', async () => {
    const { queryByTitle } = render(
      <TablePaginationActions
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        keyboardActive={keyboardActive}
        tableWidth={tableWidth}
        translator={translator}
        isInSelectionMode={isInSelectionMode}
      />
    );
    fireEvent.click(queryByTitle('SNTable.Pagination.NextPage'));
    expect(onPageChange).to.have.been.calledWith(sinon.match.any, 2);

    fireEvent.click(queryByTitle('SNTable.Pagination.PreviousPage'));
    expect(onPageChange).to.have.been.calledWith(sinon.match.any, 0);
  });

  it('should not call focusConfirmButton when pressing tab on last page button and isInSelectionMode is false', async () => {
    const { queryByTitle } = render(
      <TablePaginationActions
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        keyboardActive={keyboardActive}
        tableWidth={tableWidth}
        translator={translator}
        isInSelectionMode={isInSelectionMode}
      />
    );
    fireEvent.keyDown(queryByTitle('SNTable.Pagination.LastPage'), { key: 'Tab' });
    expect(handleCellFocus.focusConfirmButton).to.not.have.been.called;
  });

  it('should not call focusConfirmButton when pressing shift + tab on last page button and isInSelectionMode is true', async () => {
    isInSelectionMode = true;

    const { queryByTitle } = render(
      <TablePaginationActions
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        keyboardActive={keyboardActive}
        tableWidth={tableWidth}
        translator={translator}
        isInSelectionMode={isInSelectionMode}
      />
    );
    fireEvent.keyDown(queryByTitle('SNTable.Pagination.LastPage'), { key: 'Tab', shiftKey: true });
    expect(handleCellFocus.focusConfirmButton).to.not.have.been.called;
  });

  it('should call focusConfirmButton when pressing tab on last page button and isInSelectionMode is true', async () => {
    isInSelectionMode = true;

    const { queryByTitle } = render(
      <TablePaginationActions
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        keyboardActive={keyboardActive}
        tableWidth={tableWidth}
        translator={translator}
        isInSelectionMode={isInSelectionMode}
      />
    );
    fireEvent.keyDown(queryByTitle('SNTable.Pagination.LastPage'), { key: 'Tab' });
    expect(handleCellFocus.focusConfirmButton).to.have.been.calledOnce;
  });

  it('should call focusConfirmButton when pressing tab on next page button, isInSelectionMode is true and tableWidth < 350', async () => {
    isInSelectionMode = true;
    tableWidth = 300;

    const { queryByTitle } = render(
      <TablePaginationActions
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        keyboardActive={keyboardActive}
        tableWidth={tableWidth}
        translator={translator}
        isInSelectionMode={isInSelectionMode}
      />
    );
    fireEvent.keyDown(queryByTitle('SNTable.Pagination.NextPage'), { key: 'Tab' });
    expect(handleCellFocus.focusConfirmButton).to.have.been.calledOnce;
  });
});
