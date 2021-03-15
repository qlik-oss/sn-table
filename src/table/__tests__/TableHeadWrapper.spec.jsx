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
      <TableHeadWrapper tableData={tableData} theme={theme} layout={layout} changeSortOrder={changeSortOrder} />
    );
    fireEvent.click(queryByText('someDim'));

    expect(changeSortOrder).to.have.been.calledWith(true, 0);
  });
});
