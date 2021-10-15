import './rtl-setup';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import TableWrapper from '../TableWrapper';
import * as TableBodyWrapper from '../TableBodyWrapper';
import * as TableHeadWrapper from '../TableHeadWrapper';
import * as handleKeyPress from '../../utils/handle-key-press';

describe('<TableWrapper />', () => {
  let tableData;
  let setPageInfo;
  let constraints;
  let rowsPerPage;
  let selectionsAPI;
  let modal;
  let rootElement;
  let keyboard;
  let translator;
  let rect;

  beforeEach(() => {
    sinon.stub(TableBodyWrapper, 'default').returns(<tbody />);
    sinon.stub(TableHeadWrapper, 'default').returns(<thead />);
    sinon.stub(handleKeyPress, 'handleTableWrapperKeyDown').returns(sinon.spy());

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
      getElementsByTagName: () => [{ clientHeight: {}, contains: sinon.spy() }],
      querySelector: () => {},
    };
    keyboard = { enabled: false, active: false };
    translator = { get: (s) => s };
    rect = {
      width: 551,
    };
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
        keyboard={keyboard}
        translator={translator}
        rect={rect}
      />
    );

    expect(queryByLabelText('SNTable.Accessibility.RowsAndColumns')).to.be.visible;
    expect(queryByLabelText('SNTable.Pagination.RowsPerPage')).to.be.visible;
    expect(queryByTestId('table-wrapper')).to.has.attr('tabindex', '-1');
    expect(queryByTestId('table-wrapper')).to.has.attr('role', 'application');
    expect(queryByText('SNTable.Pagination.DisplayedRowsLabel')).to.be.visible;
    expect(queryByText(rowsPerPage)).to.be.visible;
  });

  it('should call handleTableWrapperKeyDown when press control key on the table', () => {
    const { queryByLabelText } = render(
      <TableWrapper
        tableData={tableData}
        setPageInfo={setPageInfo}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        rootElement={rootElement}
        keyboard={keyboard}
        translator={translator}
        rect={rect}
      />
    );

    fireEvent.keyDown(queryByLabelText('SNTable.Pagination.RowsPerPage'), { key: 'Control', code: 'ControlLeft' });
    expect(handleKeyPress.handleTableWrapperKeyDown).to.have.been.calledOnce;
  });

  it('should call setPageInfo when changing rows per page', () => {
    const { getByTestId } = render(
      <TableWrapper
        tableData={tableData}
        setPageInfo={setPageInfo}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        rootElement={rootElement}
        keyboard={keyboard}
        translator={translator}
        rect={rect}
      />
    );
    fireEvent.change(getByTestId('select'), { target: { value: 25 } });
    expect(setPageInfo).to.have.been.calledWith({ top: 0, height: 25 });
  });

  it('should change back to first page when not on first page and no rows', () => {
    const { queryByTitle } = render(
      <TableWrapper
        tableData={tableData}
        setPageInfo={setPageInfo}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        rootElement={rootElement}
        keyboard={keyboard}
        translator={translator}
        rect={rect}
      />
    );
    // This is a hack to simulate when selections are made on other page than first page and
    // rows per page is bigger than the selected rows -> handle data returns no rows.
    tableData.rows = [];
    fireEvent.click(queryByTitle('SNTable.Pagination.NextPage'));

    // Called when pressing the button
    expect(setPageInfo).to.have.been.calledWith({ top: rowsPerPage, height: rowsPerPage });
    // Called from if statement in TableWrapper
    expect(setPageInfo).to.have.been.calledWith({ top: 0, height: rowsPerPage });
  });

  it('should not render rows per page section in table when width smaller than 550', () => {
    rect = {
      width: 474,
    };
    const { queryByLabelText } = render(
      <TableWrapper
        tableData={tableData}
        setPageInfo={setPageInfo}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        rootElement={rootElement}
        keyboard={keyboard}
        translator={translator}
        rect={rect}
      />
    );

    expect(queryByLabelText('SNTable.RowsPerPage')).to.be.a('null');
  });

  it('should not show rows per page when selectionsAPI.isModal() returns true', () => {
    modal = true;

    const { queryByText } = render(
      <TableWrapper
        tableData={tableData}
        setPageInfo={setPageInfo}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        rootElement={rootElement}
        keyboard={keyboard}
        translator={translator}
        rect={rect}
      />
    );
    const rppSiblingElement = queryByText(`SNTable.Pagination.DisplayedRowsLabel`);

    // Can't check if rows per page is not visible, so check if parent has correct amount of child elements
    expect(rppSiblingElement.parentNode.childElementCount).to.equal(3);
  });
});
