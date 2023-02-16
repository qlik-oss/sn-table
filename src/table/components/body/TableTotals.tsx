import React, { memo } from 'react';
import TableRow from '@mui/material/TableRow';

import { useContextSelector, TableContext } from '../../context';
import { handleTotalKeyDown } from '../../utils/handle-key-press';
import { removeTabAndFocusCell } from '../../utils/accessibility-utils';
import { StyledTotalsCell } from './styles';
import { TableTotalsProps } from '../../types';
import CellText from '../CellText';
import CellTextWrapper from '../CellTextWrapper';

function TableTotals({ areBasicFeaturesEnabled }: TableTotalsProps) {
  const {
    columns,
    totalsPosition: { atTop },
    rows,
  } = useContextSelector(TableContext, (value) => value.tableData);
  const { rootElement, selectionsAPI, keyboard, styling } = useContextSelector(
    TableContext,
    (value) => value.baseProps
  );
  const headRowHeight = useContextSelector(TableContext, (value) => value.headRowHeight);
  const setFocusedCellCoord = useContextSelector(TableContext, (value) => value.setFocusedCellCoord);

  return (
    <TableRow className="sn-table-row">
      {columns.map((column, columnIndex) => {
        const cellCoord: [number, number] = [atTop ? 1 : rows.length + 1, columnIndex];
        return (
          <StyledTotalsCell
            totalsStyle={styling.totals}
            headRowHeight={headRowHeight}
            atTop={atTop}
            key={column.id}
            align={column.align}
            className="sn-table-cell"
            tabIndex={-1}
            onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
              handleTotalKeyDown(
                e,
                rootElement,
                cellCoord,
                setFocusedCellCoord,
                selectionsAPI.isModal(),
                areBasicFeaturesEnabled
              );
            }}
            onMouseDown={() => {
              removeTabAndFocusCell(cellCoord, rootElement, setFocusedCellCoord, keyboard);
            }}
          >
            <CellTextWrapper>
              <CellText>{column.totalInfo}</CellText>
            </CellTextWrapper>
          </StyledTotalsCell>
        );
      })}
    </TableRow>
  );
}

export default memo(TableTotals);
