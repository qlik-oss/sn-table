import React from 'react';
import { render } from '@testing-library/react';
import TableCell from '@mui/material/TableCell';

import { TableContextProvider } from '../../context';
import * as withSelections from '../withSelections';
import { Announce, ExtendedSelectionAPI, Cell, Column } from '../../../types';
import { CellStyle, CellHOCProps } from '../../types';

describe('withSelections', () => {
  const value = '100';
  const selectionsAPI = { isModal: () => false } as unknown as ExtendedSelectionAPI;
  let HOC: (props: CellHOCProps) => JSX.Element;
  let cell: Cell;
  let styling: CellStyle;
  let announce: Announce;
  let column: Column;
  let selectionDispatchMock: jest.Mock<any, any>;
  let isFlagEnabled: (flag: string) => boolean;

  const renderWithSelections = () =>
    render(
      <TableContextProvider selectionsAPI={selectionsAPI} selectionDispatchMock={selectionDispatchMock}>
        <HOC cell={cell} styling={styling} announce={announce} column={column} isFlagEnabled={isFlagEnabled}>
          {value}
        </HOC>
      </TableContextProvider>
    );

  beforeEach(() => {
    HOC = withSelections.default((props: CellHOCProps) => <TableCell {...props}>{props.children}</TableCell>);
    cell = {
      isSelectable: true,
    } as unknown as Cell;
    styling = {} as unknown as CellStyle;
    announce = () => undefined as unknown as Announce;
    selectionDispatchMock = jest.fn();
    isFlagEnabled = (flag) => !!flag;
  });

  afterEach(() => jest.clearAllMocks());

  it('should render a mocked component with the passed value', () => {
    const { queryByText } = renderWithSelections();

    expect(queryByText(value)).toBeVisible();
  });
});
