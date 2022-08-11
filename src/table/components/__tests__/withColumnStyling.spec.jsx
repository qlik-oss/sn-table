import React from 'react';
import { render } from '@testing-library/react';

import * as withColumnStyling from '../withColumnStyling';
import * as stylingUtils from '../../utils/styling-utils.ts';

describe('withColumnStyling', () => {
  let HOC;
  let cell;
  let column;
  let styling;

  beforeEach(() => {
    HOC = withColumnStyling.default((props) => <div {...props}>{props.children}</div>);
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
    const { queryByText } = render(
      <HOC value="" cell={cell} column={column} styling={styling}>
        someValue
      </HOC>
    );

    expect(queryByText('someValue')).toBeVisible();
    expect(stylingUtils.getColumnStyle).toHaveBeenCalledWith(styling, cell.qAttrExps, column.stylingInfo);
  });
});
