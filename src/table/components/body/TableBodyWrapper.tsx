import React, { useEffect, useMemo, memo } from 'react';

import getCellRenderer from '../../utils/get-cell-renderer';
import { useContextSelector, TableContext } from '../../context';
import { StyledBodyRow, StyledBody } from './styles';
import { addSelectionListeners } from '../../utils/selections-utils';
import { handleBodyKeyDown, handleBodyKeyUp } from '../../utils/handle-key-press';
import { handleClickToFocusBody } from '../../utils/handle-click';
import { Cell } from '../../../types';
import { TableBodyWrapperProps } from '../../types';
import TableTotals from './TableTotals';
import CellText from '../CellText';

function TableBodyWrapper({
  tableData,
  setShouldRefocus,
  tableWrapperRef,
  announce,
  areBasicFeaturesEnabled,
}: TableBodyWrapperProps) {
  const { rows, columns, paginationNeeded, totalsPosition } = tableData;
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

  useEffect(() => {
    addSelectionListeners({
      api: selectionsAPI,
      selectionDispatch,
      setShouldRefocus,
      keyboard,
      tableWrapperRef,
    });
  }, []);

  const totals = <TableTotals tableData={tableData} areBasicFeaturesEnabled={areBasicFeaturesEnabled} />;

  return (
    <StyledBody lastRowBottomBorder={lastRowBottomBorder}>
      {totalsPosition.atTop ? totals : undefined}
      {rows.map((row) => (
        <StyledBodyRow
          hoverColors={hoverColors}
          hover={hoverEffect}
          tabIndex={-1}
          key={row.id}
          className="sn-table-row"
        >
          {columns.map((column, columnIndex) => {
            const { id, align } = column;
            // Note that rows are not necessarily ordered in qColumnOrder.
            // So for each row, the cells are mapped according to column.id
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
                areBasicFeaturesEnabled,
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
                  styling={cellStyle} // TODO see if we should rename this to cellStyle
                  tabIndex={-1}
                  announce={announce}
                  areBasicFeaturesEnabled={areBasicFeaturesEnabled}
                  onKeyDown={handleKeyDown}
                  onKeyUp={(evt: React.KeyboardEvent) =>
                    handleBodyKeyUp(evt, selectionDispatch, areBasicFeaturesEnabled)
                  }
                  onMouseDown={() =>
                    handleClickToFocusBody(cell, rootElement, setFocusedCellCoord, keyboard, totalsPosition)
                  }
                >
                  <CellText>{cell.qText}</CellText>
                </CellRenderer>
              )
            );
          })}
        </StyledBodyRow>
      ))}
      {totalsPosition.atBottom ? totals : undefined}
    </StyledBody>
  );
}

export default memo(TableBodyWrapper);
