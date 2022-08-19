import React from 'react';
import { render } from '@testing-library/react';
import TableCell from '@mui/material/TableCell';

import * as withColumnStyling from '../withColumnStyling';
import * as stylingUtils from '../../utils/styling-utils';
import { Cell, CellStyle, Column, hocProps, Announce } from '../../../types';

describe('withColumnStyling', () => {
  let HOC: (props: hocProps) => JSX.Element;
  let cell: Cell;
  let styling: CellStyle;
  let column: Column;
  let announce: Announce;

  beforeEach(() => {
    HOC = withColumnStyling.default((props: hocProps) => <TableCell {...props}>{props.children}</TableCell>);
    jest.spyOn(stylingUtils, 'getColumnStyle');

    styling = {} as unknown as CellStyle;
    cell = {
      qAttrExps: {
        qValues: [],
      },
    } as unknown as Cell;
    column = {
      stylingIDs: [],
    } as unknown as Column;
    announce = () => undefined as unknown as Announce;
  });

  afterEach(() => jest.clearAllMocks());

  it('should render table head', () => {
    const { queryByText } = render(
      <HOC cell={cell} column={column} styling={styling} announce={announce}>
        someValue
      </HOC>
    );

    expect(queryByText('someValue')).toBeVisible();
    expect(stylingUtils.getColumnStyle).toHaveBeenCalledWith(styling, cell.qAttrExps, column.stylingIDs);
  });
});
