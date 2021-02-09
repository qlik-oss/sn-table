import '../../../test-setup'
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import TableWrapper from '../TableWrapper';
import * as TableBodyWrapper from '../TableBodyWrapper';
import * as TableHeadWrapper from '../TableHeadWrapper';

describe('<TableWrapper />', () => {
  const sandbox = sinon.createSandbox();
  let tableData;
  let setPageInfo;
  let constraints;
  let rowsPerPage;

  const mockContents = () => {
    sandbox.replace(TableBodyWrapper, 'default', () => <tbody></tbody>);
    sandbox.replace(TableHeadWrapper, 'default', () => <thead></thead>);
  }

  beforeEach(() => {
    tableData = {
      size: { qcy: 200},
      rows: [{ qText: '1' }],
    };
    setPageInfo = sinon.spy();
    constraints = {};
    rowsPerPage = 100;
  });

  beforeEach(() => {
    sandbox.verifyAndRestore();
    sandbox.resetHistory();
  });

  it('should render table', () => {
    mockContents();

    const { queryByLabelText, queryByText } = render(
      <TableWrapper tableData={tableData} setPageInfo={setPageInfo} constraints={constraints} />
    );

    expect(queryByLabelText('sticky table')).to.be.visible;
    expect(queryByText(`1-${rowsPerPage} of ${tableData.size.qcy}`)).to.be.visible;
    expect(queryByText(rowsPerPage)).to.be.visible;
  });
  it('should call setPageInfo when clicking next page button', async () => {
    mockContents();

    const { findByTitle } = render(
      <TableWrapper tableData={tableData} setPageInfo={setPageInfo} constraints={constraints} />
    );
    const nextPageButton = await findByTitle('Next page');
    fireEvent.click(nextPageButton);

    expect(setPageInfo).to.have.been.calledWith({ top: rowsPerPage, height: rowsPerPage });
  });
  it('should change back to first page when no rows', async () => {
    mockContents();
    tableData.rows = [];

    const { findByTitle } = render(
      <TableWrapper tableData={tableData} setPageInfo={setPageInfo} constraints={constraints} />
    );
    const nextPageButton = await findByTitle('Next page');
    fireEvent.click(nextPageButton);

    expect(setPageInfo).to.have.been.calledWith({ top: rowsPerPage, height: rowsPerPage });
    expect(setPageInfo).to.have.been.calledWith({ top: 0, height: rowsPerPage });
  });

  // it('should call setPageInfo when changing rows per page', async () => {
  //   mockContents();

  //   const { findByText } = render(
  //     <TableWrapper tableData={tableData} setPageInfo={setPageInfo} constraints={constraints} />
  //   );
  //   fireEvent.click(await findByText('100'));
  //   const rowsPerPageOption = await screen.findByText('25'); // is outside the TableWrapper in the dom
  //   console.log(rowsPerPageOption);
  //   fireEvent.click(rowsPerPageOption);

  //   expect(setPageInfo).to.have.been.calledWith({ top: 0, height: rowsPerPage });
  // });
});
