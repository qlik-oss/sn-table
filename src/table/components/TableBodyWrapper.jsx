import React, { useEffect, useMemo, memo, forwardRef } from 'react';
import PropTypes from 'prop-types';
import getCellRenderer from './renderer';
import { useContextSelector, TableContext } from '../context';
import { StyledTableBody, StyledBodyRow } from '../styles';
import { addSelectionListeners } from '../utils/selections-utils';
import { getBodyCellStyle } from '../utils/styling-utils';
import { bodyHandleKeyPress } from '../utils/handle-key-press';
import { handleClickToFocusBody } from '../utils/handle-accessibility';

const TableBodyWrapper = forwardRef(
  (
    {
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
    },
    ref
  ) => {
    const { rows, columns, paginationNeeded } = tableData;
    const setFocusedCellCoord = useContextSelector(TableContext, (value) => value.setFocusedCellCoord);
    const selectionDispatch = useContextSelector(TableContext, (value) => value.selectionDispatch);
    // active: turn off interactions that affect the state of the visual representation including selection, zoom, scroll, etc.
    // select: turn off selections.
    const selectionsEnabled = !!selectionsAPI && !constraints.active && !constraints.select;
    const columnRenderers = useMemo(
      () => columns.map((column) => getCellRenderer(!!column.stylingInfo.length, selectionsEnabled)),
      [columns, selectionsEnabled]
    );
    const bodyCellStyle = useMemo(() => getBodyCellStyle(layout, theme), [layout, theme]);
    const hoverEffect = layout.components?.[0]?.content?.hoverEffect;
    const cellStyle = { color: bodyCellStyle.color, backgroundColor: theme.table.backgroundColor };

    useEffect(() => {
      addSelectionListeners({ api: selectionsAPI, selectionDispatch, setShouldRefocus, keyboard, tableWrapperRef });
    }, []);

    return (
      <StyledTableBody ref={ref} paginationNeeded={paginationNeeded} bodyCellStyle={bodyCellStyle}>
        {rows.map((row, rowIndex) => (
          <StyledBodyRow
            bodyCellStyle={bodyCellStyle}
            hover={hoverEffect}
            tabIndex={-1}
            key={row.key}
            className="sn-table-row"
          >
            {columns.map((column, columnIndex) => {
              const { id, align } = column;
              const cell = row[id];
              const CellRenderer = columnRenderers[columnIndex];
              const handleKeyDown = (evt) => {
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
          </StyledBodyRow>
        ))}
      </StyledTableBody>
    );
  }
);

TableBodyWrapper.displayName = 'TableBodyWrapper';

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
