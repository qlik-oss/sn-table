import { styled } from '@mui/system';
import React, { useReducer, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import { addSelectionListeners, reducer } from '../utils/selections-utils';
import getCellRenderer from './renderer';
import { getBodyStyle } from '../utils/styling-utils';
import { bodyHandleKeyPress } from '../utils/handle-key-press';
import { handleClickToFocusBody } from '../utils/handle-accessibility';

const CustomTableBody = styled(TableBody)(({ bodyStyle }) => ({
  '& td, th': {
    color: bodyStyle.color,
    fontSize: bodyStyle.fontSize,
    padding: bodyStyle.padding,
  },
}));

const CustomTableRow = styled(TableRow)(({ hover, bodyStyle }) => ({
  '&&:hover': {
    '& td:not(.selected), th:not(.selected)': {
      backgroundColor: hover && bodyStyle.hoverBackgroundColor,
      color: hover && bodyStyle.hoverFontColor,
    },
  },
}));
function TableBodyWrapper({
  rootElement,
  tableData,
  constraints,
  selectionsAPI,
  layout,
  theme,
  setShouldRefocus,
  setFocusedCellCoord,
  keyboard,
  tableWrapperRef,
  announce,
}) {
  const { rows, columns } = tableData;
  const hoverEffect = layout.components?.[0]?.content?.hoverEffect;
  const bodyStyle = useMemo(() => getBodyStyle(layout, theme), [layout, theme.name()]);
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
    <CustomTableBody bodyStyle={bodyStyle}>
      {rows.map((row, rowIndex) => (
        <CustomTableRow hover={hoverEffect} bodyStyle={bodyStyle} tabIndex={-1} key={row.key} className="sn-table-row">
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
                  announce={announce}
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
        </CustomTableRow>
      ))}
    </CustomTableBody>
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
  keyboard: PropTypes.object.isRequired,
  tableWrapperRef: PropTypes.object.isRequired,
  announce: PropTypes.func.isRequired,
};

export default TableBodyWrapper;
