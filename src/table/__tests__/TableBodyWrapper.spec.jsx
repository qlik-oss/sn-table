import './rtl-setup';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { generateDataPages, generateLayout } from './generate-test-data';
import manageData from '../handle-data';

import TableBodyWrapper from '../TableBodyWrapper';
import * as selectionsUtils from '../selections-utils';
import * as getCellRenderer from '../cells/renderer';
import * as handleKeyPress from '../cells/handle-key-press';
import * as handleCellFocus from '../cells/handle-cell-focus';

describe('<TableBodyWrapper />', async () => {
  const model = { getHyperCubeData: async () => generateDataPages(2, 2) };

  let tableData;
  let constraints;
  let selectionsAPI;
  let layout;
  let theme;
  let cellRendererSpy;

  beforeEach(async () => {
    sinon.stub(selectionsUtils, 'addSelectionListeners').returns(sinon.spy());

    tableData = await manageData(model, generateLayout(1, 1), { top: 0, height: 100 });
    constraints = {};
    selectionsAPI = {};
    theme = {
      getColorPickerColor: () => {},
      name: () => {},
    };
    layout = {};
    cellRendererSpy = sinon.spy();
  });

  afterEach(() => {
    sinon.verifyAndRestore();
    sinon.resetHistory();
  });

  it('should render 2x2 table body and call CellRenderer', () => {
    // eslint-disable-next-line react/prop-types
    sinon.stub(getCellRenderer, 'default').returns(({ value }) => {
      cellRendererSpy();
      return <td>{value}</td>;
    });

    const { queryByText } = render(
      <TableBodyWrapper
        tableData={tableData}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        layout={layout}
        theme={theme}
      />
    );

    expect(cellRendererSpy).to.have.callCount(8);
    expect(queryByText(tableData.rows[0]['col-0'].qText)).to.be.visible;
    expect(queryByText(tableData.rows[0]['col-1'].qText)).to.be.visible;
    expect(queryByText(tableData.rows[1]['col-0'].qText)).to.be.visible;
    expect(queryByText(tableData.rows[1]['col-1'].qText)).to.be.visible;
  });

  it('should call bodyHandleKeyPress on keyDown', () => {
    sinon.stub(handleKeyPress, 'bodyHandleKeyPress').returns(sinon.spy());

    const { queryByText } = render(
      <TableBodyWrapper
        tableData={tableData}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        theme={theme}
        layout={layout}
      />
    );
    fireEvent.keyDown(queryByText(tableData.rows[0]['col-0'].qText));

    expect(handleKeyPress.bodyHandleKeyPress).to.have.been.calledOnce;
  });

  it('should call handleClickToFocusBody on mouseDown', () => {
    sinon.stub(handleCellFocus, 'handleClickToFocusBody').returns(sinon.spy());

    const { queryByText } = render(
      <TableBodyWrapper
        tableData={tableData}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        theme={theme}
        layout={layout}
      />
    );
    fireEvent.mouseDown(queryByText(tableData.rows[0]['col-0'].qText));

    expect(handleCellFocus.handleClickToFocusBody).to.have.been.calledOnce;
  });
});
