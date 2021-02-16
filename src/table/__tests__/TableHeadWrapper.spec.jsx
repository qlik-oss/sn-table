import './rtl-setup';
import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import TableHeadWrapper from '../TableHeadWrapper';

describe('<TableHeadWrapper />', () => {
  let tableData;
  let theme;
  let layout;

  beforeEach(() => {
    tableData = {
      columns: [
        { id: 1, align: 'left', label: 'someDim' },
        { id: 2, align: 'right', label: 'someMsr' },
      ],
    };
    theme = {
      getColorPickerColor: () => {},
    };
    layout = {};
  });

  it('should render table head', () => {
    const { queryByText } = render(<TableHeadWrapper tableData={tableData} theme={theme} layout={layout} />);

    expect(queryByText(tableData.columns[0].label)).to.be.visible;
    expect(queryByText(tableData.columns[1].label)).to.be.visible;
  });
});
