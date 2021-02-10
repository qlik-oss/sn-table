import '../../../test-setup';
import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import TableHeadWrapper from '../TableHeadWrapper';

describe('<TableHeadWrapper />', () => {
  let tableData;

  beforeEach(() => {
    tableData = {
      columns: [
        { id: 1, align: 'left', label: 'someDim' },
        { id: 2, align: 'right', label: 'someMsr' },
      ],
    };
  });

  it('should render table head', () => {
    const { queryByText } = render(<TableHeadWrapper tableData={tableData} />);

    expect(queryByText(tableData.columns[0].label)).to.be.visible;
    expect(queryByText(tableData.columns[1].label)).to.be.visible;
  });
});
