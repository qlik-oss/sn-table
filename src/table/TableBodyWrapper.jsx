import React, { useReducer, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import { addSelectionListeners, reducer } from './selections-utils';
import getCellRenderer from './cells/renderer';
import { getBodyStyle } from './styling-utils';
import { bodyHandleKeyPress } from './cells/handle-key-press';
import { handleClickToFocusBody, getCellSrNotation } from './cells/handle-cell-focus';

const useStyles = makeStyles({
  cellBase: {
    '& td, th': {
      color: ({ color }) => color,
      fontSize: ({ fontSize }) => fontSize,
      padding: ({ padding }) => padding,
    },
  },
  hoverTableRow: {
    '&&:hover': {
      '& td:not(.selected), th:not(.selected)': {
        backgroundColor: ({ hoverBackgroundColor }) => hoverBackgroundColor,
        color: ({ hoverFontColor }) => hoverFontColor,
      },
    },
  },
  srOnly: {
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: '1px',
    overflow: 'hidden',
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: '1px',
  },
});

function TableBodyWrapper({
  rootElement,
  tableData,
  constraints,
  translator,
  selectionsAPI,
  layout,
  theme,
  setShouldRefocus,
  setFocusedCellCoord,
  focusedCellCoord,
  keyboard,
}) {
  const { rows, columns } = tableData;
  const hoverEffect = layout.components?.[0]?.content?.hoverEffect;
  const bodyStyle = useMemo(() => getBodyStyle(layout, theme), [layout, theme.name()]);
  const classes = useStyles(bodyStyle);
  const selectionsEnabled = !!selectionsAPI && !constraints.active;
  const getColumnRenderers = tableData.columns.map((c) => getCellRenderer(!!c.stylingInfo.length, selectionsEnabled));
  const [columnRenderers, setColumnRenderers] = useState(() => getColumnRenderers);
  const [selState, selDispatch] = useReducer(reducer, {
    api: selectionsAPI,
    rows: [],
    colIdx: -1,
    isEnabled: selectionsEnabled,
  });
  const [srNotation, setSrNotation] = useState('');

  useEffect(() => {
    selDispatch({ type: 'set-enabled', payload: { isEnabled: selectionsEnabled } });
    setColumnRenderers(getColumnRenderers);
  }, [selectionsEnabled, columns.length]);

  useEffect(() => {
    addSelectionListeners(selectionsAPI, selDispatch, setShouldRefocus);
  }, []);

  useEffect(() => {
    setSrNotation(getCellSrNotation({ focusedCellCoord, rootElement, selState, translator }));
  }, [focusedCellCoord, selState, translator]);

  return (
    <>
      <label className={classes.srOnly} aria-live="assertive">
        {srNotation}
      </label>
      <TableBody className={`${classes.cellBase}`}>
        {rows.map((row, rowIndex) => (
          <TableRow
            hover={hoverEffect}
            tabIndex={-1}
            key={row.key}
            className={`sn-table-row ${hoverEffect && classes.hoverTableRow}`}
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
                    value={value}
                    key={column.id}
                    align={column.align}
                    styling={{}}
                    selState={selState}
                    selDispatch={selDispatch}
                    tabIndex={-1}
                    onKeyDown={(evt) =>
                      bodyHandleKeyPress(
                        evt,
                        rootElement,
                        [rowIndex + 1, columnIndex],
                        selState,
                        cell,
                        selDispatch,
                        selectionsEnabled,
                        setFocusedCellCoord
                      )
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
    </>
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
  setShouldRefocus: PropTypes.func.isRequired,
  keyboard: PropTypes.func.isRequired,
};

export default TableBodyWrapper;
