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

  beforeEach(() => {
    tableData = {
      columns: [
        { id: 1, align: 'left', label: 'someDim', sortDirection: 'asc', isDim: true },
        { id: 2, align: 'right', label: 'someMsr', sortDirection: 'desc', isDim: false },
      ],
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
  });

  afterEach(() => {
    sinon.verifyAndRestore();
    sinon.resetHistory();
  });

  it('should render table head', () => {
    const { queryByText } = render(
      <TableHeadWrapper tableData={tableData} theme={theme} layout={layout} changeSortOrder={changeSortOrder} />
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
      />
    );
    fireEvent.mouseDown(queryByText(tableData.columns[0].label));

    expect(handleCellFocus.handleClickToFocusHead).to.have.been.calledOnce;
  });

  it('should has `scope` property set to col', () => {
    const { queryByText } = render(
      <TableHeadWrapper tableData={tableData} theme={theme} layout={layout} changeSortOrder={changeSortOrder} />
    );

    const firstColQuery = queryByText(tableData.columns[0].label).closest('th');
    const secondColQuery = queryByText(tableData.columns[1].label).closest('th');

    expect(firstColQuery).to.have.attribute('scope', 'col');
    expect(secondColQuery).to.have.attribute('scope', 'col');
  });

  it('should has `role` property set to button', () => {
    const { queryByText } = render(
      <TableHeadWrapper tableData={tableData} theme={theme} layout={layout} changeSortOrder={changeSortOrder} />
    );

    const firstColQuery = queryByText(tableData.columns[0].label).closest('th');
    const secondColQuery = queryByText(tableData.columns[1].label).closest('th');

    expect(firstColQuery).to.have.attribute('role', 'button');
    expect(secondColQuery).to.have.attribute('role', 'button');
  });

  it('should has `aria-sort` property', () => {
    const { queryByText } = render(
      <TableHeadWrapper tableData={tableData} theme={theme} layout={layout} changeSortOrder={changeSortOrder} />
    );

    const firstColQuery = queryByText(tableData.columns[0].label).closest('th');
    const secondColQuery = queryByText(tableData.columns[1].label).closest('th');

    expect(firstColQuery).to.have.attribute('aria-sort', 'ascending');
    expect(secondColQuery).to.not.have.attribute('aria-sort');
  });

  it('should has `aria-pressed` property', () => {
    const { queryByText } = render(
      <TableHeadWrapper tableData={tableData} theme={theme} layout={layout} changeSortOrder={changeSortOrder} />
    );

    const firstColQuery = queryByText(tableData.columns[0].label).closest('th');
    const secondColQuery = queryByText(tableData.columns[1].label).closest('th');

    expect(firstColQuery).to.have.attribute('aria-pressed', 'true');
    expect(secondColQuery).to.have.attribute('aria-pressed', 'false');
  });

  it('should change `aria-pressed` and `aria-sort` when we sort by second column', () => {
    tableData = {
      columns: [
        { ...tableData.columns[0], sortDirection: 'desc' },
        { ...tableData.columns[1], sortDirection: 'asc' },
      ],
    };
    layout = {
      qHyperCube: {
        qEffectiveInterColumnSortOrder: [1, 0],
      },
    };

    const { queryByText } = render(
      <TableHeadWrapper
        tableData={tableData}
        theme={theme}
        layout={layout}
        changeSortOrder={changeSortOrder}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
      />
    );

    const firstColQuery = queryByText(tableData.columns[0].label).closest('th');
    const secondColQuery = queryByText(tableData.columns[1].label).closest('th');

    expect(firstColQuery).to.not.have.attribute('aria-sort');
    expect(firstColQuery).to.have.attribute('aria-pressed', 'false');
    expect(secondColQuery).to.have.attribute('aria-pressed', 'true');
    expect(secondColQuery).to.have.attribute('aria-sort', 'ascending');
  });

  it('should render the visually hidden text instead of `aria-label` properly', () => {
    const { queryByTestId } = render(
      <TableHeadWrapper
        tableData={tableData}
        theme={theme}
        layout={layout}
        changeSortOrder={changeSortOrder}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
      />
    );

    const firstColHiddenLabel = queryByTestId('VHL-for-col-0');
    const secondColHiddenLabel = queryByTestId('VHL-for-col-1');

    expect(firstColHiddenLabel).to.have.text('Sorted ascending. Press space to sort on this column.');
    expect(secondColHiddenLabel).to.have.text('Press space to sort on this column.');
  });
});
