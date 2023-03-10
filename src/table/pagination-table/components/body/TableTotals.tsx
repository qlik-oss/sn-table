import React, { memo } from 'react';
import TableRow from '@mui/material/TableRow';

import { useContextSelector, TableContext } from '../../../context';
import { handleTotalKeyDown } from '../../../utils/handle-keyboard';
import { removeTabAndFocusCell } from '../../../utils/accessibility-utils';
import { StyledTotalsCell } from './styles';
import CellText from '../../../components/CellText';

function TableTotals() {
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
        const { textAlign, autoTotalsCellTextAlgin } = column;
        const cellCoord: [number, number] = [atTop ? 1 : rows.length + 1, columnIndex];
        const tabIndex = atTop && columnIndex === 0 ? 0 : -1;
        const align = textAlign.auto ? autoTotalsCellTextAlgin : textAlign.align;

        return (
          <StyledTotalsCell
            totalsStyle={styling.totals}
            headRowHeight={headRowHeight}
            atTop={atTop}
            key={column.id}
            align={align}
            className="sn-table-cell"
            tabIndex={tabIndex}
            onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
              handleTotalKeyDown(e, rootElement, cellCoord, setFocusedCellCoord, selectionsAPI.isModal());
            }}
            onMouseDown={() => {
              removeTabAndFocusCell(cellCoord, rootElement, setFocusedCellCoord, keyboard);
            }}
          >
            <CellText fontSize={styling.totals.fontSize}>{column.totalInfo}</CellText>
          </StyledTotalsCell>
        );
      })}
    </TableRow>
  );
}

export default memo(TableTotals);
