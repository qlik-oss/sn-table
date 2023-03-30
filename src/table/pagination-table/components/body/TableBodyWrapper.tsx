import React, { useMemo, memo } from 'react';

import getCellRenderer from '../../utils/get-cell-renderer';
import { useContextSelector, TableContext } from '../../../context';
import { StyledBodyRow, StyledBody } from './styles';
import { handleBodyKeyDown, handleBodyKeyUp } from '../../../utils/handle-keyboard';
import { handleMouseDownToFocusBody } from '../../../utils/handle-click';
import { Cell } from '../../../../types';
import { TableBodyWrapperProps } from '../../../types';
import TableTotals from './TableTotals';
import CellText from '../../../components/CellText';
import useSelectionListener from '../../../hooks/use-selection-listener';

function TableBodyWrapper({ setShouldRefocus, tableWrapperRef, announce }: TableBodyWrapperProps) {
  const { rows, columns, paginationNeeded, totalsPosition } = useContextSelector(
    TableContext,
    (value) => value.tableData
  );
  const {
    selectionsAPI,
    rootElement,
    keyboard,
    layout,
    constraints,
    styling: {
      body: { hoverColors, lastRowBottomBorder, ...cellStyle },
    },
  } = useContextSelector(TableContext, (value) => value.baseProps);
  const setFocusedCellCoord = useContextSelector(TableContext, (value) => value.setFocusedCellCoord);
  const selectionDispatch = useContextSelector(TableContext, (value) => value.selectionDispatch);
  // constraints.active: true - turn off interactions that affect the state of the visual
  // representation including selection, zoom, scroll, etc.
  // constraints.select: true - turn off selections.
  const isSelectionsEnabled = !constraints.active && !constraints.select;
  const columnsStylingIDsJSON = JSON.stringify(columns.map((column) => column.stylingIDs));
  const columnRenderers = useMemo(
    () =>
      JSON.parse(columnsStylingIDsJSON).map((stylingIDs: string[]) =>
        getCellRenderer(!!stylingIDs.length, isSelectionsEnabled)
      ),
    [columnsStylingIDsJSON, isSelectionsEnabled]
  );
  const hoverEffect = layout.components?.[0]?.content?.hoverEffect;

  useSelectionListener({ keyboard, selectionDispatch, selectionsAPI, setShouldRefocus, tableWrapperRef });

  return (
    <StyledBody lastRowBottomBorder={lastRowBottomBorder}>
      {totalsPosition.atTop ? <TableTotals /> : undefined}
      {rows.map((row, rowIndex) => (
        <StyledBodyRow
          hoverColors={hoverColors}
          hover={hoverEffect}
          tabIndex={-1}
          key={row.id}
          className="sn-table-row"
        >
          {columns.map((column, columnIndex) => {
            const { id } = column;
            const cell = row[id] as Cell;
            const CellRenderer = columnRenderers[columnIndex];
            const tabIndex = rowIndex === 0 && columnIndex === 0 && !totalsPosition.atTop && !keyboard.enabled ? 0 : -1;
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
                  align={cell.align}
                  styling={cellStyle} // TODO see if we should rename this to cellStyle
                  tabIndex={tabIndex}
                  announce={announce}
                  title={!constraints.passive ? cell.qText : undefined}
                  onKeyDown={handleKeyDown}
                  onKeyUp={(evt: React.KeyboardEvent) => handleBodyKeyUp(evt, selectionDispatch)}
                  onMouseDown={() =>
                    handleMouseDownToFocusBody(cell, rootElement, setFocusedCellCoord, keyboard, totalsPosition)
                  }
                >
                  <CellText fontSize={cellStyle.fontSize}>{cell.qText}</CellText>
                </CellRenderer>
              )
            );
          })}
        </StyledBodyRow>
      ))}
      {totalsPosition.atBottom ? <TableTotals /> : undefined}
    </StyledBody>
  );
}

export default memo(TableBodyWrapper);
