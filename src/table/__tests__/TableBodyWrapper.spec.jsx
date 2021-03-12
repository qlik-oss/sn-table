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

describe('<TableBodyWrapper />', async () => {
  const sandbox = sinon.createSandbox();
  const model = { getHyperCubeData: async () => generateDataPages(2, 2) };

  let tableData;
  let constraints;
  let selectionsAPI;
  let layout;
  let theme;

  beforeEach(async () => {
    sandbox.replace(selectionsUtils, 'addSelectionListeners', () => {});

    tableData = await manageData(model, generateLayout(1, 1), { top: 0, height: 100 });
    constraints = {};
    selectionsAPI = {};
    theme = {
      getColorPickerColor: () => {},
    };
    layout = {};
  });

  afterEach(() => {
    sandbox.verifyAndRestore();
    sandbox.resetHistory();
  });

  it('should render 2x2 table body and call CellRenderer', () => {
    const cellRendererSpy = sinon.spy();
    // eslint-disable-next-line react/prop-types
    sandbox.replace(getCellRenderer, 'default', () => ({ value }) => {
      cellRendererSpy();
      return <td>{value}</td>;
    });

    const { queryByText } = render(
      <TableBodyWrapper
        tableData={tableData}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        theme={theme}
        layout={layout}
      />
    );

    expect(cellRendererSpy).to.have.callCount(8);
    expect(queryByText(tableData.rows[0]['id-0'].qText)).to.be.visible;
    expect(queryByText(tableData.rows[0]['id-1'].qText)).to.be.visible;
    expect(queryByText(tableData.rows[1]['id-0'].qText)).to.be.visible;
    expect(queryByText(tableData.rows[1]['id-1'].qText)).to.be.visible;
  });

  it('should call handleKeyPress on keyDown', () => {
    sandbox.replace(handleKeyPress, 'default', sinon.spy());

    const { queryByText } = render(
      <TableBodyWrapper
        tableData={tableData}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        theme={theme}
        layout={layout}
      />
    );
    fireEvent.keyDown(queryByText(tableData.rows[0]['id-0'].qText));

    expect(handleKeyPress.default).to.have.been.calledOnce;
  });
});
