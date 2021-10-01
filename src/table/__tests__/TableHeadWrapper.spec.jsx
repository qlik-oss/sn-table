import './rtl-setup';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import TableHeadWrapper from '../TableHeadWrapper';
import * as handleKeyPress from '../cells/handle-key-press';
import * as handleCellFocus from '../cells/handle-cell-focus';

describe('<TableHeadWrapper />', () => {
  let tableData;
  let theme;
  let layout;
  let changeSortOrder;
  let constraints;
  let selectionsAPI;
  let keyboard;
  let translator;

  beforeEach(() => {
    tableData = {
      columns: [
        { id: 1, align: 'left', label: 'someDim', sortDirection: 'asc', isDim: true },
        { id: 2, align: 'right', label: 'someMsr', sortDirection: 'desc', isDim: false },
      ],
      columnOrder: [0, 1],
    };
    theme = {
      getColorPickerColor: () => {},
      name: () => {},
    };
    layout = {
      qHyperCube: {
        qEffectiveInterColumnSortOrder: [0, 1],
      },
    };
    changeSortOrder = sinon.spy();
    constraints = {
      active: false,
    };
    selectionsAPI = {
      isModal: () => false,
    };
    keyboard = {
      enabled: false,
    };
    translator = { get: (s) => s };
  });

  afterEach(() => {
    sinon.verifyAndRestore();
    sinon.resetHistory();
  });

  it('should render table head', () => {
    const { queryByText } = render(
      <TableHeadWrapper
        tableData={tableData}
        theme={theme}
        layout={layout}
        changeSortOrder={changeSortOrder}
        keyboard={keyboard}
        translator={translator}
      />
    );

    expect(queryByText(tableData.columns[0].label)).to.be.visible;
    expect(queryByText(tableData.columns[1].label)).to.be.visible;
  });

  it('should call changeSortOrder when clicking a header cell', () => {
    const { queryByText } = render(
      <TableHeadWrapper
        tableData={tableData}
        theme={theme}
        layout={layout}
        changeSortOrder={changeSortOrder}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        keyboard={keyboard}
        translator={translator}
      />
    );
    fireEvent.click(queryByText(tableData.columns[0].label));

    expect(changeSortOrder).to.have.been.calledWith(layout, true, 0);
  });

  it('should not call changeSortOrder when clicking a header cell in edit mode', () => {
    constraints = {
      active: true,
    };
    const { queryByText } = render(
      <TableHeadWrapper
        tableData={tableData}
        theme={theme}
        layout={layout}
        changeSortOrder={changeSortOrder}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        keyboard={keyboard}
        translator={translator}
      />
    );
    fireEvent.click(queryByText(tableData.columns[0].label));

    expect(changeSortOrder).not.have.been.called;
  });

  it('should not call changeSortOrder when clicking a header cell and cells are selected', () => {
    selectionsAPI = {
      isModal: () => true,
    };
    const { queryByText } = render(
      <TableHeadWrapper
        tableData={tableData}
        theme={theme}
        layout={layout}
        changeSortOrder={changeSortOrder}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        keyboard={keyboard}
        translator={translator}
      />
    );
    fireEvent.click(queryByText(tableData.columns[0].label));

    expect(changeSortOrder).not.have.been.called;
  });

  it('should call headHandleKeyPress when keyDown on a header cell', () => {
    sinon.stub(handleKeyPress, 'headHandleKeyPress').returns(sinon.spy());

    const { queryByText } = render(
      <TableHeadWrapper
        tableData={tableData}
        theme={theme}
        layout={layout}
        changeSortOrder={changeSortOrder}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        keyboard={keyboard}
        translator={translator}
      />
    );
    fireEvent.keyDown(queryByText(tableData.columns[0].label));

    expect(handleKeyPress.headHandleKeyPress).to.have.been.calledOnce;
  });

  it('should call handleClickToFocusHead when clicking a header cell', () => {
    sinon.stub(handleCellFocus, 'handleClickToFocusHead').returns(sinon.spy());

    const { queryByText } = render(
      <TableHeadWrapper
        tableData={tableData}
        theme={theme}
        layout={layout}
        changeSortOrder={changeSortOrder}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        keyboard={keyboard}
        translator={translator}
      />
    );
    fireEvent.mouseDown(queryByText(tableData.columns[0].label));

    expect(handleCellFocus.handleClickToFocusHead).to.have.been.calledOnce;
  });

  it('should render the visually hidden text instead of `aria-label` and has correct `scope` properly', () => {
    const { queryByText, queryByTestId } = render(
      <TableHeadWrapper
        tableData={tableData}
        theme={theme}
        layout={layout}
        changeSortOrder={changeSortOrder}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        keyboard={keyboard}
        translator={translator}
      />
    );

    const firstColQuery = queryByText(tableData.columns[0].label).closest('th');
    const secondColQuery = queryByText(tableData.columns[1].label).closest('th');

    // check scope
    expect(firstColQuery).to.have.attribute('scope', 'col');
    expect(secondColQuery).to.have.attribute('scope', 'col');

    const firstColHiddenLabel = queryByTestId('VHL-for-col-0');
    const secondColHiddenLabel = queryByTestId('VHL-for-col-1');

    // check label
    expect(firstColHiddenLabel).to.have.text('SNTable.SortLabel.SortedAscending. SNTable.SortLabel.PressSpaceToSort');
    expect(secondColHiddenLabel).to.have.text('SNTable.SortLabel.PressSpaceToSort');
  });
});
