import './rtl-setup';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import TableWrapper from '../TableWrapper';
import * as TableBodyWrapper from '../TableBodyWrapper';
import * as TableHeadWrapper from '../TableHeadWrapper';
import * as handleKeyPress from '../cells/handle-key-press';

describe('<TableWrapper />', () => {
  let tableData;
  let setPageInfo;
  let constraints;
  let rowsPerPage;
  let selectionsAPI;
  let modal;
  let rootElement;
  let translator;

  beforeEach(() => {
    sinon.stub(TableBodyWrapper, 'default').returns(<tbody />);
    sinon.stub(TableHeadWrapper, 'default').returns(<thead />);
    sinon.stub(handleKeyPress, 'updatePage').returns(sinon.spy());

    tableData = {
      size: { qcy: 200 },
      rows: [{ qText: '1' }],
      columns: [{}],
    };
    setPageInfo = sinon.spy();
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
    translator = { get: (s) => s };
  });

  afterEach(() => {
    sinon.verifyAndRestore();
    sinon.resetHistory();
  });

  it('should render table', () => {
    const { queryByLabelText, queryByText, queryByTestId } = render(
      <TableWrapper
        tableData={tableData}
        setPageInfo={setPageInfo}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        rootElement={rootElement}
        translator={translator}
      />
    );

    expect(queryByLabelText('SNTable.RowsAndColumns')).to.be.visible;
    expect(queryByLabelText('SNTable.RowsPerPage')).to.be.visible;
    expect(queryByTestId('table-wrapper')).to.has.attr('tabindex', '-1');
    expect(queryByText(`1-${rowsPerPage} of ${tableData.size.qcy}`)).to.be.visible;
    expect(queryByText(rowsPerPage)).to.be.visible;
  });

  it('should call updatePage when press control key on the table', () => {
    const { queryByLabelText } = render(
      <TableWrapper
        tableData={tableData}
        setPageInfo={setPageInfo}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        rootElement={rootElement}
        translator={translator}
      />
    );

    fireEvent.keyDown(queryByLabelText('SNTable.RowsPerPage'), { key: 'Control', code: 'ControlLeft' });
    expect(handleKeyPress.updatePage).to.have.been.calledOnce;
  });

  it('should call setPageInfo when clicking next page button', async () => {
    const { findByTitle, findByText } = render(
      <TableWrapper
        tableData={tableData}
        setPageInfo={setPageInfo}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        rootElement={rootElement}
        translator={translator}
      />
    );
    fireEvent.click(await findByTitle('Next page'));

    expect(setPageInfo).to.have.been.calledWith({ top: rowsPerPage, height: rowsPerPage });
    expect(await findByText(`101-200 of ${tableData.size.qcy}`)).to.be.visible;
  });

  it('should change back to first page when not on first page and no rows', async () => {
    const { findByTitle } = render(
      <TableWrapper
        tableData={tableData}
        setPageInfo={setPageInfo}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        rootElement={rootElement}
        translator={translator}
      />
    );
    // This is a hack to simulate when selections are made on other page than first page and
    // rows per page is bigger than the selected rows -> handle data returns no rows.
    tableData.rows = [];
    fireEvent.click(await findByTitle('Next page'));

    // Called when pressing the button
    expect(setPageInfo).to.have.been.calledWith({ top: rowsPerPage, height: rowsPerPage });
    // Called from if statement in TableWrapper
    expect(setPageInfo).to.have.been.calledWith({ top: 0, height: rowsPerPage });
  });

  it('should call setPageInfo when changing rows per page', async () => {
    const { getByTestId } = render(
      <TableWrapper
        tableData={tableData}
        setPageInfo={setPageInfo}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        rootElement={rootElement}
        translator={translator}
      />
    );
    fireEvent.change(getByTestId('select'), { target: { value: 25 } });
    expect(setPageInfo).to.have.been.calledWith({ top: 0, height: 25 });
  });

  it('should not show rows per page when selectionsAPI.isModal() returns true', async () => {
    modal = true;

    const { queryByText } = render(
      <TableWrapper
        tableData={tableData}
        setPageInfo={setPageInfo}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        rootElement={rootElement}
        translator={translator}
      />
    );
    const rppSiblingElement = queryByText(`1-${rowsPerPage} of ${tableData.size.qcy}`);

    // Can't check if rows per page is not visible, so check if parent has correct amount of child elements
    expect(rppSiblingElement.parentNode.childElementCount).to.equal(3);
  });
});
