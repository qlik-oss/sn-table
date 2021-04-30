import './rtl-setup';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import TableWrapper from '../TableWrapper';
import TableBodyWrapper from '../TableBodyWrapper';
import * as TableHeadWrapper from '../TableHeadWrapper';
import * as handleKeyPress from '../cells/handle-key-press';

describe('<TableWrapper />', () => {
  const sandbox = sinon.createSandbox();
  let tableData;
  let setPageInfo;
  let page;
  let setPage;
  let rowsPerPage;
  let setRowsPerPage;
  let constraints;
  let selectionsAPI;
  let modal;
  let rootElement;

  beforeEach(() => {
    sandbox.replace(TableBodyWrapper, 'type', () => <tbody />);
    sandbox.replace(TableHeadWrapper, 'default', () => <thead />);

    tableData = {
      size: { qcy: 200 },
      rows: [{ qText: '1' }],
      columns: [{}],
    };
    setPageInfo = sinon.spy();
    page = 0;
    setPage = sinon.spy();
    setRowsPerPage = sinon.spy();
    constraints = {};
    rowsPerPage = 100;
    selectionsAPI = {
      isModal: () => modal,
    };
    modal = false;
    rootElement = {
      getElementsByClassName: () => [],
      clientHeight: {},
      getElementsByTagName: () => [{ clientHeight: {} }],
    };
    sandbox.replace(handleKeyPress, 'updatePage', sinon.spy());
  });

  afterEach(() => {
    sandbox.verifyAndRestore();
    sandbox.resetHistory();
  });

  it('should render table', () => {
    const { queryByLabelText, queryByText } = render(
      <TableWrapper
        tableData={tableData}
        setPageInfo={setPageInfo}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        rootElement={rootElement}
      />
    );

    expect(queryByLabelText('showing 2 rows and 1 columns')).to.be.visible;
    expect(queryByText(`1-${rowsPerPage} of ${tableData.size.qcy}`)).to.be.visible;
    expect(queryByText(rowsPerPage)).to.be.visible;
  });

  it('should call updatePage when press control key on the table', () => {
    const { queryByLabelText } = render(
      <TableWrapper
        tableData={tableData}
        setPageInfo={setPageInfo}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        rootElement={rootElement}
      />
    );

    fireEvent.keyDown(queryByLabelText('showing 2 rows and 1 columns'), { key: 'Control', code: 'ControlLeft' });
    expect(handleKeyPress.updatePage).to.have.been.calledOnce;
  });

  it('should call setPageInfo and setPage when clicking next page button', async () => {
    const { findByTitle } = render(
      <TableWrapper
        tableData={tableData}
        setPageInfo={setPageInfo}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        rootElement={rootElement}
      />
    );
    fireEvent.click(await findByTitle('Next page'));

    expect(setPageInfo).to.have.been.calledWith({ top: rowsPerPage, height: rowsPerPage });
    expect(setPage).to.have.been.calledWith(1);
  });

  it('should call setPageInfo when changing rows per page', async () => {
    const { findByText } = render(
      <TableWrapper
        tableData={tableData}
        setPageInfo={setPageInfo}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        rootElement={rootElement}
      />
    );
    // the popover is only triggered with mouseDown, according to the mui definition
    fireEvent.mouseDown(await findByText(rowsPerPage));
    fireEvent.click(await findByText('25'));

    expect(setPageInfo).to.have.been.calledWith({ top: 0, height: 25 });
    expect(setRowsPerPage).to.have.been.calledWith(25);
    expect(setPage).to.have.been.calledWith(0);
  });

  it('should not show rows per page when selectionsAPI.isModal() returns true', async () => {
    modal = true;

    const { queryByText } = render(
      <TableWrapper
        tableData={tableData}
        setPageInfo={setPageInfo}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        rootElement={rootElement}
      />
    );
    const rppSiblingElement = queryByText(`1-${rowsPerPage} of ${tableData.size.qcy}`);

    // Can't check if rows per page is not visible, so check if parent has correct amount of child elements
    expect(rppSiblingElement.parentNode.childElementCount).to.equal(3);
  });
});
