import React from 'react';
import { render } from '@testing-library/react';
import TableCell from '@mui/material/TableCell';

import * as withColumnStyling from '../withColumnStyling';
import * as stylingUtils from '../../../utils/styling-utils';
import { Cell, Column, Announce } from '../../../../types';
import { CellStyle, CellHOCProps } from '../../../types';

describe('withColumnStyling', () => {
  let HOC: (props: CellHOCProps) => JSX.Element;
  let cell: Cell;
  let styling: CellStyle;
  let column: Column;
  let announce: Announce;
  let areBasicFeaturesEnabled: boolean;

  beforeEach(() => {
    HOC = withColumnStyling.default((props: CellHOCProps) => <TableCell>{props.children}</TableCell>);
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
      <table>
        <tbody>
          <tr>
            <HOC
              cell={cell}
              column={column}
              styling={styling}
              announce={announce}
              areBasicFeaturesEnabled={areBasicFeaturesEnabled}
            >
              someValue
            </HOC>
          </tr>
        </tbody>
      </table>
    );

    expect(queryByText('someValue')).toBeVisible();
    expect(stylingUtils.getColumnStyle).toHaveBeenCalledWith(styling, cell.qAttrExps, column.stylingIDs);
  });
});
