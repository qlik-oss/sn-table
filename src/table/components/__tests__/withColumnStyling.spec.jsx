import React from 'react';
import { render } from '@testing-library/react';

import * as withColumnStyling from '../withColumnStyling';
import * as stylingUtils from '../../utils/styling-utils';

describe('withColumnStyling', () => {
  let HOC;
  let cell;
  let column;
  let styling;

  beforeEach(() => {
    // This is a bit of dummy mock. value will be on props, but this is not how the value is set. That is done in tableBodyWrapper
    // But this enables testing that withStyling uses the CellComponent correctly
    HOC = withColumnStyling.default((props) => <div {...props}>{props.value}</div>);
    jest.spyOn(stylingUtils, 'getColumnStyle').mockImplementation(() => jest.fn());

    styling = {};
    cell = {
      qAttrExps: {},
    };
    column = {
      stylingInfo: [],
    };
  });

  afterEach(() => jest.clearAllMocks());

  it('should render table head', () => {
    const { queryByText } = render(<HOC value="someValue" cell={cell} column={column} styling={styling} />);

    expect(queryByText('someValue')).toBeVisible();
    expect(stylingUtils.getColumnStyle).toHaveBeenCalledWith(styling, cell.qAttrExps, column.stylingInfo);
  });
});
