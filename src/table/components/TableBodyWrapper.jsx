import React, { useEffect, useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import getCellRenderer from './renderer';
import { useContextSelector, TableContext } from '../context';
import { addSelectionListeners } from '../utils/selections-utils';
import { getBodyCellStyle } from '../utils/styling-utils';
import { bodyHandleKeyPress } from '../utils/handle-key-press';
import { handleClickToFocusBody } from '../utils/handle-accessibility';

function TableBodyWrapper({
  rootElement,
  tableData,
  constraints,
  selectionsAPI,
  layout,
  theme,
  setShouldRefocus,
  keyboard,
  tableWrapperRef,
  announce,
}) {
  const { rows, columns, paginationNeeded } = tableData;
  const setFocusedCellCoord = useContextSelector(TableContext, (value) => value.setFocusedCellCoord);
  const selectionDispatch = useContextSelector(TableContext, (value) => value.selectionDispatch);
  // active: turn off interactions that affect the state of the visual representation including selection, zoom, scroll, etc.
  // select: turn off selections.
  const selectionsEnabled = !!selectionsAPI && !constraints.active && !constraints.select;
  const columnRenderers = useMemo(
    () => columns.map((column) => getCellRenderer(!!column.stylingInfo.length, selectionsEnabled)),
    [columns.length, selectionsEnabled]
  );
  const bodyCellStyle = useMemo(() => getBodyCellStyle(layout, theme), [layout, theme.name()]);
  const hoverEffect = layout.components?.[0]?.content?.hoverEffect;

  useEffect(() => {
    addSelectionListeners({ api: selectionsAPI, selectionDispatch, setShouldRefocus, keyboard, tableWrapperRef });
  }, []);

  const bodyRowAndCellStyle = {
    'tr :last-child': {
      borderRight: paginationNeeded && 0,
    },
    'tr :first-child': {
      borderLeft: !paginationNeeded && '1px solid rgb(217, 217, 217)',
    },
    '& td, th': {
      fontSize: bodyCellStyle.fontSize,
      padding: bodyCellStyle.padding,
    },
  };
  const rowCellStyle = hoverEffect
    ? {
        '&&:hover': {
          '& td:not(.selected), th:not(.selected)': {
            backgroundColor: bodyCellStyle.hoverBackgroundColor,
            color: bodyCellStyle.hoverFontColor,
          },
        },
      }
    : {};
  const cellStyle = { color: bodyCellStyle.color, backgroundColor: theme.table.backgroundColor };

  return (
    <TableBody sx={bodyRowAndCellStyle}>
      {rows.map((row, rowIndex) => (
        <TableRow hover={hoverEffect} tabIndex={-1} key={row.key} sx={rowCellStyle} className="sn-table-row">
          {columns.map((column, columnIndex) => {
            const { id, align } = column;
            const cell = row[id];
            const CellRenderer = columnRenderers[columnIndex];
            const handleKeyDown = (evt) => {
              let moveToCell;
              if (evt.shiftKey && ((evt.key === 'ArrowUp' && rowIndex !== 0) || evt.key === 'ArrowDown'))
                moveToCell = rows[rowIndex + (evt.key === 'ArrowDown' ? 1 : -1)][id];

              bodyHandleKeyPress({
                evt,
                rootElement,
                cellCoord: [rowIndex + 1, columnIndex],
                selectionsAPI,
                cell,
                selectionDispatch,
                isAnalysisMode: selectionsEnabled,
                setFocusedCellCoord,
                announce,
                keyboard,
                moveToCell,
              });
            };

            return (
              CellRenderer && (
                <CellRenderer
                  scope={columnIndex === 0 ? 'row' : null}
                  component={columnIndex === 0 ? 'th' : null}
                  cell={cell}
                  column={column}
                  key={id}
                  align={align}
                  styling={cellStyle}
                  tabIndex={-1}
                  announce={announce}
                  onKeyDown={handleKeyDown}
                  onMouseDown={() => handleClickToFocusBody(cell, rootElement, setFocusedCellCoord, keyboard)}
                >
                  {cell.qText}
                </CellRenderer>
              )
            );
          })}
        </TableRow>
      ))}
    </TableBody>
  );
}

TableBodyWrapper.propTypes = {
  rootElement: PropTypes.object.isRequired,
  tableData: PropTypes.object.isRequired,
  constraints: PropTypes.object.isRequired,
  selectionsAPI: PropTypes.object.isRequired,
  layout: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  setShouldRefocus: PropTypes.func.isRequired,
  keyboard: PropTypes.object.isRequired,
  tableWrapperRef: PropTypes.object.isRequired,
  announce: PropTypes.func.isRequired,
};

export default memo(TableBodyWrapper);
