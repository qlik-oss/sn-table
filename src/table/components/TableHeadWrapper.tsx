import React, { memo, useEffect, useMemo, useRef } from 'react';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';

import ColumnAdjuster from './ColumnAdjuster';
import { useContextSelector, TableContext } from '../context';
import { VisuallyHidden, StyledHeadRow, StyledSortLabel } from '../styles';
import { getHeaderStyle } from '../utils/styling-utils';
import { handleHeadKeyDown } from '../utils/handle-key-press';
import { handleMouseDownLabelToFocusHeadCell, handleClickToFocusHead } from '../utils/handle-click';
import { TableHeadWrapperProps } from '../types';
import CellText from './CellText';

function TableHeadWrapper({
  rootElement,
  tableData: { columns },
  theme,
  layout,
  changeSortOrder,
  constraints,
  translator,
  selectionsAPI,
  keyboard,
  areBasicFeaturesEnabled,
  updateColumnWidth,
}: TableHeadWrapperProps) {
  const setHeadRowHeight = useContextSelector(TableContext, (value) => value.setHeadRowHeight);
  const isFocusInHead = useContextSelector(TableContext, (value) => value.focusedCellCoord[0] === 0);
  const setFocusedCellCoord = useContextSelector(TableContext, (value) => value.setFocusedCellCoord);
  const columnWidths = useContextSelector(TableContext, (value) => value.columnWidths);
  const headerStyle = useMemo(() => getHeaderStyle(layout, theme), [layout, theme]);
  const headRowRef = useRef<HTMLElement>();
  const isInteractionEnabled = !constraints.active && !selectionsAPI.isModal();

  useEffect(() => {
    headRowRef.current && setHeadRowHeight(headRowRef.current.getBoundingClientRect().height);
  }, [headRowRef.current, headerStyle.fontSize, headRowRef.current?.getBoundingClientRect().height, columnWidths]);

  return (
    <TableHead>
      <StyledHeadRow ref={headRowRef} borderColor={theme.table.borderColor} className="sn-table-row">
        {columns.map((column, columnIndex) => {
          // The first cell in the head is focusable in sequential keyboard navigation,
          // when nebula does not handle keyboard navigation
          const tabIndex = columnIndex === 0 && !keyboard.enabled ? 0 : -1;
          const isLastColumn = columnIndex === columns.length - 1;
          const isCurrentColumnActive = layout.qHyperCube.qEffectiveInterColumnSortOrder[0] === column.colIdx;
          const ariaSort = isCurrentColumnActive
            ? (`${column.sortDirection}ending` as 'ascending' | 'descending')
            : undefined;

          const style = {
            ...(areBasicFeaturesEnabled && {
              width: (columnWidths[columnIndex] || 200) - (columnIndex === 0 ? 30 : 29), // subtract padding and border
              zIndex: columns.length - columnIndex,
            }),
          };

          const handleKeyDown = (evt: React.KeyboardEvent) => {
            handleHeadKeyDown({
              evt,
              rootElement,
              cellCoord: [0, columnIndex],
              column,
              changeSortOrder,
              isInteractionEnabled,
              setFocusedCellCoord,
              areBasicFeaturesEnabled,
            });
          };

          return (
            <TableCell
              sx={headerStyle}
              style={style}
              key={column.id}
              align={column.align}
              className="sn-table-head-cell sn-table-cell"
              tabIndex={tabIndex}
              aria-sort={ariaSort}
              aria-pressed={isCurrentColumnActive}
              onKeyDown={handleKeyDown}
              onMouseDown={() => handleClickToFocusHead(columnIndex, rootElement, setFocusedCellCoord, keyboard)}
              onClick={() => isInteractionEnabled && changeSortOrder(column)}
            >
              <StyledSortLabel
                headerStyle={headerStyle}
                active={isCurrentColumnActive}
                title={!constraints.passive ? column.sortDirection : undefined} // passive: turn off tooltips.
                direction={column.sortDirection}
                tabIndex={-1}
                onMouseDown={(evt: React.MouseEvent) =>
                  handleMouseDownLabelToFocusHeadCell(evt, rootElement, columnIndex)
                }
              >
                <CellText>{column.label}</CellText>
                {isFocusInHead && (
                  <VisuallyHidden data-testid={`VHL-for-col-${columnIndex}`}>
                    {translator.get('SNTable.SortLabel.PressSpaceToSort')}
                  </VisuallyHidden>
                )}
              </StyledSortLabel>
              {areBasicFeaturesEnabled && (
                <ColumnAdjuster column={column} isLastColumn={isLastColumn} updateColumnWidth={updateColumnWidth} />
              )}
            </TableCell>
          );
        })}
      </StyledHeadRow>
    </TableHead>
  );
}

export default memo(TableHeadWrapper);
