import React, { useReducer, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import { addSelectionListeners, reducer } from '../utils/selections-utils';
import getCellRenderer from './renderer';
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
  paginationNeeded,
  setFocusedCellCoord,
  keyboard,
  tableWrapperRef,
  announce,
}) {
  const { rows, columns } = tableData;
  const hoverEffect = layout.components?.[0]?.content?.hoverEffect;
  const bodyCellStyle = useMemo(() => getBodyCellStyle(layout, theme), [layout, theme.name()]);

  // active: turn off interactions that affect the state of the visual representation including selection, zoom, scroll, etc.
  // select: turn off selections.
  const selectionsEnabled = !!selectionsAPI && !constraints.active && !constraints.select;

  const getColumnRenderers = columns.map((column) => getCellRenderer(!!column.stylingInfo.length, selectionsEnabled));
  const [columnRenderers, setColumnRenderers] = useState(() => getColumnRenderers);
  const [selectionState, selectionDispatch] = useReducer(reducer, {
    api: selectionsAPI,
    rows: [],
    colIdx: -1,
    isEnabled: selectionsEnabled,
  });

  useEffect(() => {
    selectionDispatch({ type: 'set-enabled', payload: { isEnabled: selectionsEnabled } });
    setColumnRenderers(getColumnRenderers);
  }, [selectionsEnabled, columns.length]);

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

  const rowCellStyle = {
    '&&:hover': {
      '& td:not(.selected), th:not(.selected)': {
        backgroundColor: bodyCellStyle.hoverBackgroundColor,
        color: bodyCellStyle.hoverFontColor,
      },
    },
  };

  return (
    <TableBody sx={bodyRowAndCellStyle}>
      {rows.map((row, rowIndex) => (
        <TableRow
          hover={hoverEffect}
          tabIndex={-1}
          key={row.key}
          sx={hoverEffect && rowCellStyle}
          className="sn-table-row"
        >
          {columns.map((column, columnIndex) => {
            const cell = row[column.id];
            const value = cell.qText;
            const CellRenderer = columnRenderers[columnIndex];
            return (
              CellRenderer && (
                <CellRenderer
                  scope={columnIndex === 0 ? 'row' : null}
                  component={columnIndex === 0 ? 'th' : null}
                  cell={cell}
                  column={column}
                  key={column.id}
                  align={column.align}
                  styling={{ color: bodyCellStyle.color }}
                  themeBackgroundColor={theme.table.backgroundColor}
                  selectionState={selectionState}
                  selectionDispatch={selectionDispatch}
                  tabIndex={-1}
                  announce={announce}
                  onKeyDown={(evt) =>
                    bodyHandleKeyPress({
                      evt,
                      rootElement,
                      cellCoord: [rowIndex + 1, columnIndex],
                      selectionState,
                      cell,
                      selectionDispatch,
                      isAnalysisMode: selectionsEnabled,
                      setFocusedCellCoord,
                      announce,
                      keyboard,
                    })
                  }
                  onMouseDown={() => handleClickToFocusBody(cell, rootElement, setFocusedCellCoord, keyboard)}
                >
                  {value}
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
  setFocusedCellCoord: PropTypes.func.isRequired,
  paginationNeeded: PropTypes.bool.isRequired,
  setShouldRefocus: PropTypes.func.isRequired,
  keyboard: PropTypes.object.isRequired,
  tableWrapperRef: PropTypes.object.isRequired,
  announce: PropTypes.func.isRequired,
};

export default TableBodyWrapper;
