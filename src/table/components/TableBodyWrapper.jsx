import React, { useEffect, useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import getCellRenderer from '../utils/get-cell-renderer';
import { useContextSelector, TableContext } from '../context';
import { StyledTableBody, StyledBodyRow } from '../styles';
import { addSelectionListeners } from '../utils/selections-utils';
import { getBodyCellStyle } from '../utils/styling-utils';
import { bodyHandleKeyPress, bodyHandleKeyUp } from '../utils/handle-key-press';
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
  const { rows, columns, paginationNeeded, totalsPosition } = tableData;
  const columnsStylingInfoJSON = JSON.stringify(columns.map((column) => column.stylingInfo));
  const setFocusedCellCoord = useContextSelector(TableContext, (value) => value.setFocusedCellCoord);
  const selectionDispatch = useContextSelector(TableContext, (value) => value.selectionDispatch);
  // active: turn off interactions that affect the state of the visual representation including selection, zoom, scroll, etc.
  // select: turn off selections.
  const isSelectionsEnabled = !!selectionsAPI && !constraints.active && !constraints.select;
  const columnRenderers = useMemo(
    () =>
      JSON.parse(columnsStylingInfoJSON).map((stylingInfo) =>
        getCellRenderer(!!stylingInfo.length, isSelectionsEnabled)
      ),
    [columnsStylingInfoJSON, isSelectionsEnabled]
  );
  const bodyCellStyle = useMemo(() => getBodyCellStyle(layout, theme), [layout, theme]);
  const hoverEffect = layout.components?.[0]?.content?.hoverEffect;
  const cellStyle = { color: bodyCellStyle.color, backgroundColor: theme.table.backgroundColor };

  useEffect(() => {
    addSelectionListeners({ api: selectionsAPI, selectionDispatch, setShouldRefocus, keyboard, tableWrapperRef });
  }, []);

  return (
    <StyledTableBody paginationNeeded={paginationNeeded} bodyCellStyle={bodyCellStyle}>
      {rows.map((row) => (
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
                selectionsAPI,
                cell,
                selectionDispatch,
                isSelectionsEnabled,
                setFocusedCellCoord,
                announce,
                keyboard,
                paginationNeeded,
                totalsPosition,
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
                  onKeyUp={(evt) => bodyHandleKeyUp(evt, selectionDispatch)}
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
