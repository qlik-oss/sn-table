import './rtl-setup';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import TableHeadWrapper from '../TableHeadWrapper';

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
        { id: 2, align: 'right', label: 'someMsr', sortDirection: 'asc', isDim: false },
      ],
    };
    theme = {
      getColorPickerColor: () => {},
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

    expect(changeSortOrder).to.not.have.been.calledOnce;
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

    expect(changeSortOrder).to.not.have.been.calledOnce;
  });
});
