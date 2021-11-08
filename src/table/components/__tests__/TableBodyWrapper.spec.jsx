import './rtl-setup';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { generateDataPages, generateLayout } from '../../../__test__/generate-test-data';
import manageData from '../../../handle-data';

import TableBodyWrapper from '../TableBodyWrapper';
import * as selectionsUtils from '../../utils/selections-utils';
import * as getCellRenderer from '../renderer';
import * as handleKeyPress from '../../utils/handle-key-press';
import * as handleAccessibility from '../../utils/handle-accessibility';
import RootContext from '../../../contexts/rootContext';

describe('<TableBodyWrapper />', async () => {
  const model = { getHyperCubeData: async () => generateDataPages(2, 2) };
  let providerProps;
  let cellRendererSpy;

  beforeEach(async () => {
    sinon.stub(selectionsUtils, 'addSelectionListeners').returns(sinon.spy());
    providerProps = {
      rootElement: {},
      tableData: await manageData(model, generateLayout(1, 1), { top: 0, height: 100 }),
      constraints: {},
      selectionsAPI: {
        isModal: () => true,
      },
      layout: {},
      theme: {
        getColorPickerColor: () => {},
        name: () => {},
      },
    };
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
      <RootContext.Provider value={providerProps}>
        <TableBodyWrapper />
      </RootContext.Provider>
    );

    expect(cellRendererSpy).to.have.callCount(8);
    expect(queryByText(providerProps.tableData.rows[0]['col-0'].qText)).to.be.visible;
    expect(queryByText(providerProps.tableData.rows[0]['col-1'].qText)).to.be.visible;
    expect(queryByText(providerProps.tableData.rows[1]['col-0'].qText)).to.be.visible;
    expect(queryByText(providerProps.tableData.rows[1]['col-1'].qText)).to.be.visible;
  });

  it('should call bodyHandleKeyPress on key down', () => {
    sinon.stub(handleKeyPress, 'bodyHandleKeyPress').returns(sinon.spy());

    const { queryByText } = render(
      <RootContext.Provider value={providerProps}>
        <TableBodyWrapper />
      </RootContext.Provider>
    );
    fireEvent.keyDown(queryByText(providerProps.tableData.rows[0]['col-0'].qText));

    expect(handleKeyPress.bodyHandleKeyPress).to.have.been.calledOnce;
  });

  it('should call handleClickToFocusBody on mouseDown', () => {
    sinon.stub(handleAccessibility, 'handleClickToFocusBody').returns(sinon.spy());

    const { queryByText } = render(
      <RootContext.Provider value={providerProps}>
        <TableBodyWrapper />
      </RootContext.Provider>
    );
    fireEvent.mouseDown(queryByText(providerProps.tableData.rows[0]['col-0'].qText));

    expect(handleAccessibility.handleClickToFocusBody).to.have.been.calledOnce;
  });
});
