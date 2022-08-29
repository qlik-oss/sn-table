import React, { useEffect, useMemo, memo } from 'react';
import getCellRenderer from '../utils/get-cell-renderer';
import { useContextSelector, TableContext } from '../context';
import { StyledTableBody, StyledBodyRow } from '../styles';
import { addSelectionListeners } from '../utils/selections-utils';
import { getBodyCellStyle } from '../utils/styling-utils';
import { handleBodyKeyDown, handleBodyKeyUp } from '../utils/handle-key-press';
import { handleClickToFocusBody } from '../utils/handle-accessibility';
import { Cell } from '../../types';
import { TableBodyWrapperProps } from '../types';
import TableTotals from './TableTotals';

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
}: TableBodyWrapperProps) {
  const { rows, columns, paginationNeeded, totalsPosition } = tableData;
  const columnsStylingIDsJSON = JSON.stringify(columns.map((column) => column.stylingIDs));
  const setFocusedCellCoord = useContextSelector(TableContext, (value) => value.setFocusedCellCoord);
  const selectionDispatch = useContextSelector(TableContext, (value) => value.selectionDispatch);
  // constraints.active: true - turn off interactions that affect the state of the visual
  // representation including selection, zoom, scroll, etc.
  // constraints.select: true - turn off selections.
  const isSelectionsEnabled = !constraints.active && !constraints.select;
  const columnRenderers = useMemo(
    () =>
      JSON.parse(columnsStylingIDsJSON).map((stylingIDs: string[]) =>
        getCellRenderer(!!stylingIDs.length, isSelectionsEnabled)
      ),
    [columnsStylingIDsJSON, isSelectionsEnabled]
  );
  const bodyCellStyle = useMemo(() => getBodyCellStyle(layout, theme), [layout, theme]);
  const hoverEffect = layout.components?.[0]?.content?.hoverEffect;
  const cellStyle = { color: bodyCellStyle.color, backgroundColor: theme.table.backgroundColor };
  useEffect(() => {
    addSelectionListeners({
      api: selectionsAPI,
      selectionDispatch,
      setShouldRefocus,
      keyboard,
      tableWrapperRef,
    });
  }, []);

  const totals = (
    <TableTotals rootElement={rootElement} tableData={tableData} theme={theme} layout={layout} keyboard={keyboard} />
  );

  return (
    <StyledTableBody paginationNeeded={paginationNeeded} bodyCellStyle={bodyCellStyle}>
      {totalsPosition === 'top' ? totals : undefined}
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
            const cell = row[id] as Cell;
            const CellRenderer = columnRenderers[columnIndex];
            const handleKeyDown = (evt: React.KeyboardEvent) => {
              handleBodyKeyDown({
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
                  onKeyUp={(evt: React.KeyboardEvent) => handleBodyKeyUp(evt, selectionDispatch)}
                  onMouseDown={() =>
                    handleClickToFocusBody(cell, rootElement, setFocusedCellCoord, keyboard, totalsPosition)
                  }
                >
                  {cell.qText}
                </CellRenderer>
              )
            );
          })}
        </StyledBodyRow>
      ))}
      {totalsPosition === 'bottom' ? totals : undefined}
    </StyledTableBody>
  );
}

export default memo(TableBodyWrapper);
