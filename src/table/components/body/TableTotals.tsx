import React, { memo, useMemo } from 'react';
import TableRow from '@mui/material/TableRow';

import { useContextSelector, TableContext } from '../../context';
import { getTotalsCellStyle } from '../../utils/styling-utils';
import { handleTotalKeyDown } from '../../utils/handle-key-press';
import { removeTabAndFocusCell } from '../../utils/accessibility-utils';
import { StyledTotalsCell } from './styles';
import { TableTotalsProps } from '../../types';
import CellText from '../CellText';

function TableTotals({
  rootElement,
  tableData,
  theme,
  layout,
  keyboard,
  selectionsAPI,
  areBasicFeaturesEnabled,
}: TableTotalsProps) {
  const { columns, totalsPosition, rows } = tableData;
  const headRowHeight = useContextSelector(TableContext, (value) => value.headRowHeight);
  const setFocusedCellCoord = useContextSelector(TableContext, (value) => value.setFocusedCellCoord);
  const totalsStyle = useMemo(() => getTotalsCellStyle(layout, theme), [layout, theme.name()]);
  const isTop = totalsPosition === 'top';

  return (
    <TableRow className="sn-table-row">
      {columns.map((column, columnIndex) => {
        const cellCoord: [number, number] = [isTop ? 1 : rows.length + 1, columnIndex];
        return (
          <StyledTotalsCell
            totalsStyle={totalsStyle}
            headRowHeight={headRowHeight}
            isTop={isTop}
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
            <CellText>{column.totalInfo}</CellText>
          </StyledTotalsCell>
        );
      })}
    </TableRow>
  );
}

export default memo(TableTotals);
