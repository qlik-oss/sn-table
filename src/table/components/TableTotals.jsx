import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { useContextSelector, TableContext } from '../context';
import { getHeaderStyle, getTotalsCellStyle } from '../utils/styling-utils';
import { totalHandleKeyPress } from '../utils/handle-key-press';
import { removeAndFocus } from '../utils/handle-accessibility';

function TableTotals({ rootElement, tableData, theme, layout, translator, keyboard }) {
  const { columns, paginationNeeded, totalsPosition, rows } = tableData;
  const setFocusedCellCoord = useContextSelector(TableContext, (value) => value.setFocusedCellCoord);
  const totalCellStyle = useMemo(() => getHeaderStyle(layout, theme), [layout, theme.name()]);
  const headRowStyle = {
    '& :last-child': {
      borderRight: paginationNeeded && 0,
    },
    'th:first-of-type': {
      borderLeft: !paginationNeeded && '1px solid rgb(217, 217, 217)',
    },
  };

  return (
    <TableRow sx={headRowStyle} className="sn-table-row">
      {columns.map((column, columnIndex) => {
        const cellCoord = [totalsPosition === 'bottom' ? rows.length + 1 : 1, columnIndex];
        return (
          <TableCell
            sx={getTotalsCellStyle(totalCellStyle, totalsPosition)}
            key={column.id}
            align={column.align}
            className="sn-table-total-cell sn-table-cell"
            tabIndex={-1}
            onKeyDown={(e) => {
              totalHandleKeyPress(e, rootElement, cellCoord, setFocusedCellCoord);
            }}
            onMouseDown={() => {
              removeAndFocus(cellCoord, rootElement, setFocusedCellCoord, keyboard);
            }}
          >
            {translator.get(column.totalInfo)}
          </TableCell>
        );
      })}
    </TableRow>
  );
}

TableTotals.propTypes = {
  rootElement: PropTypes.object.isRequired,
  tableData: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  layout: PropTypes.object.isRequired,
  keyboard: PropTypes.object.isRequired,
  translator: PropTypes.object.isRequired,
};

export default memo(TableTotals);
