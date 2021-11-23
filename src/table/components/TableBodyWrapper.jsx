import React, { useReducer, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import { addSelectionListeners, reducer } from '../utils/selections-utils';
import getCellRenderer from './renderer';
import { getBodyStyle } from '../utils/styling-utils';
import { bodyHandleKeyPress } from '../utils/handle-key-press';
import { handleClickToFocusBody } from '../utils/handle-accessibility';
import { useRootContext } from '../../contexts/rootContext';
import useAnnounce from '../../hooks/useAnnounce';

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
});

function TableBodyWrapper({ setShouldRefocus, setFocusedCellCoord, tableWrapperRef }) {
  const {
    nebulaProps: { rootElement, layout, tableData, constraints, selectionsAPI, keyboard, theme },
  } = useRootContext();
  const { rows, columns } = tableData;
  const hoverEffect = layout.components?.[0]?.content?.hoverEffect;
  const bodyStyle = useMemo(() => getBodyStyle(layout, theme), [layout, theme.name()]);
  const classes = useStyles(bodyStyle);
  const announce = useAnnounce();
  const selectionsEnabled = !!selectionsAPI && !constraints.active;
  const getColumnRenderers = tableData.columns.map((c) => getCellRenderer(!!c.stylingInfo.length, selectionsEnabled));
  const [columnRenderers, setColumnRenderers] = useState(() => getColumnRenderers);
  const [selectionState, selDispatch] = useReducer(reducer, {
    api: selectionsAPI,
    rows: [],
    colIdx: -1,
    isEnabled: selectionsEnabled,
  });

  useEffect(() => {
    selDispatch({ type: 'set-enabled', payload: { isEnabled: selectionsEnabled } });
    setColumnRenderers(getColumnRenderers);
  }, [selectionsEnabled, columns.length]);

  useEffect(() => {
    addSelectionListeners({ api: selectionsAPI, selDispatch, setShouldRefocus, keyboard, tableWrapperRef });
  }, []);

  return (
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
                  selectionState={selectionState}
                  selDispatch={selDispatch}
                  tabIndex={-1}
                  onKeyDown={(evt) =>
                    bodyHandleKeyPress({
                      evt,
                      rootElement,
                      cellCoord: [rowIndex + 1, columnIndex],
                      selectionState,
                      cell,
                      selDispatch,
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
  setFocusedCellCoord: PropTypes.func.isRequired,
  setShouldRefocus: PropTypes.func.isRequired,
  tableWrapperRef: PropTypes.object.isRequired,
};

export default TableBodyWrapper;
