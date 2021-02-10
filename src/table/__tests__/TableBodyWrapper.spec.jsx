import '../../../test-setup';
import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { generateDataPages, generateLayout } from '../../__test__/generate-test-data';
import manageData from '../handle-data';

import TableBodyWrapper from '../TableBodyWrapper';
import * as selectionsUtils from '../selections-utils';
import * as renderer from '../cells/renderer';

describe('<TableBodyWrapper />', async () => {
  const sandbox = sinon.createSandbox();
  const model = { getHyperCubeData: async () => generateDataPages(2, 2) };

  let tableData;
  let constraints;
  let selectionsAPI;

  beforeEach(async () => {
    sandbox.replace(selectionsUtils, 'addSelectionListeners', () => {});

    tableData = await manageData(model, generateLayout(1, 1), { top: 0, height: 100 });
    constraints = {};
    selectionsAPI = {};
  });

  afterEach(() => {
    sandbox.verifyAndRestore();
    sandbox.resetHistory();
  });

  it('should render 2x2 table body without CellRenderer', () => {
    sandbox.replace(renderer, 'getCellRenderer', () => {});

    const { queryByText } = render(
      <TableBodyWrapper tableData={tableData} constraints={constraints} selectionsAPI={selectionsAPI} />
    );

    expect(queryByText(tableData.rows[0]['id-0'].qText)).to.be.visible;
    expect(queryByText(tableData.rows[0]['id-1'].qText)).to.be.visible;
    expect(queryByText(tableData.rows[1]['id-0'].qText)).to.be.visible;
    expect(queryByText(tableData.rows[1]['id-1'].qText)).to.be.visible;
  });
  it('should render 2x2 table body and call CellRenderer', () => {
    const cellRendererSpy = sinon.spy();
    // eslint-disable-next-line react/prop-types
    sandbox.replace(renderer, 'getCellRenderer', () => ({ value }) => {
      cellRendererSpy();
      return <td>{value}</td>;
    });

    const { queryByText } = render(
      <TableBodyWrapper tableData={tableData} constraints={constraints} selectionsAPI={selectionsAPI} />
    );

    expect(cellRendererSpy).to.have.callCount(4);
    expect(queryByText(tableData.rows[0]['id-0'].qText)).to.be.visible;
    expect(queryByText(tableData.rows[0]['id-1'].qText)).to.be.visible;
    expect(queryByText(tableData.rows[1]['id-0'].qText)).to.be.visible;
    expect(queryByText(tableData.rows[1]['id-1'].qText)).to.be.visible;
  });
});
