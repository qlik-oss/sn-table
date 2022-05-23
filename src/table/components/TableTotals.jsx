import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { getHeaderStyle, showTotalsAtTop } from '../utils/styling-utils';
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
  const totalCellStyle = () => {
    headerStyle.borderColor = '#a6a6a6';
    showTotalsAtTop(layout)
      ? (headerStyle.borderWidth = '0px 1px 2px 0px')
      : (headerStyle.borderWidth = '2px 1px 1px 0px');
    return [headerStyle, { fontWeight: 'bold' }];
  };
  const headRowStyle = {
    '& :last-child': {
      borderRight: paginationNeeded && 0,
    },
    'th:first-of-type': {
      borderLeft: !paginationNeeded && '1px solid rgb(217, 217, 217)',
    },
  };

  const totalRowStyle = () => {
    if (showTotalsAtTop(layout)) return [headRowStyle, { position: 'sticky', top: 35 }];
    return [headRowStyle, { position: 'sticky', bottom: 0 }];
  };

  let measureIndex = 0;
  const setTotals = (column, columnIndex) => {
    let totalsHeader;
    if (column.isDim) {
      totalsHeader =
        columnIndex === 0
          ? layout.totals.label !== undefined
            ? layout.totals.label
            : translator.get('Object.Table.Totals')
          : '\u00A0';
    }
    if (!column.isDim) {
      totalsHeader = layout.qHyperCube.qGrandTotalRow[measureIndex].qText;
      measureIndex += 1;
    }
    return totalsHeader;
  };

  return (
    <TableRow sx={totalRowStyle()} className="sn-table-row">
      {columns.map((column, columnIndex) => {
        const tabIndex = columnIndex === 0 && !keyboard.enabled ? 0 : -1;

        return (
          <TableCell
            sx={totalCellStyle()}
            key={column.id}
            align={column.align}
            tabIndex={tabIndex}
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
            {setTotals(column, columnIndex)}
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
