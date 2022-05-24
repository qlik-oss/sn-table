import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { getHeaderStyle, getTotalsCellStyle } from '../utils/styling-utils';
import { headHandleKeyPress } from '../utils/handle-key-press';
import { handleClickToFocusHead } from '../utils/handle-accessibility';

function TableTotals({
  rootElement,
  tableData,
  theme,
  layout,
  changeSortOrder,
  constraints,
  translator,
  setFocusedCellCoord,
  keyboard,
}) {
  const { columns, paginationNeeded } = tableData;
  const headerStyle = useMemo(() => getHeaderStyle(layout, theme), [layout, theme.name()]);
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
        return (
          <TableCell
            sx={getTotalsCellStyle(headerStyle, layout)}
            key={column.id}
            align={column.align}
            tabIndex={-1}
            onKeyDown={(e) =>
              headHandleKeyPress(
                e,
                rootElement,
                [0, columnIndex],
                column,
                changeSortOrder,
                layout,
                !constraints.active,
                setFocusedCellCoord
              )
            }
            onMouseDown={() => handleClickToFocusHead(columnIndex, rootElement, setFocusedCellCoord, keyboard)}
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
  changeSortOrder: PropTypes.func.isRequired,
  constraints: PropTypes.object.isRequired,
  keyboard: PropTypes.object.isRequired,
  translator: PropTypes.object.isRequired,
  setFocusedCellCoord: PropTypes.func.isRequired,
};

export default TableTotals;
