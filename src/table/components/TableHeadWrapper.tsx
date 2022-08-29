import React, { memo, useEffect, useMemo, useRef, createRef, DragEvent } from 'react';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';

import { useContextSelector, TableContext } from '../context';
import { VisuallyHidden, StyledHeadRow, StyledSortLabel } from '../styles';
import { getHeaderStyle } from '../utils/styling-utils';
import { handleHeadKeyDown } from '../utils/handle-key-press';
import { handleMouseDownLabelToFocusHeadCell, handleClickToFocusHead } from '../utils/handle-accessibility';
import { handleDragStart, handleDragOver, handleDragEnd } from '../utils/handle-drag-columns';
import createThrottler from '../utils/throttler';
import { TableHeadWrapperProps } from '../types';

function TableHeadWrapper({
  rootElement,
  tableData,
  theme,
  layout,
  changeSortOrder,
  constraints,
  translator,
  selectionsAPI,
  keyboard,
  model,
  direction,
  engagedColumn,
  setEngagedColumn,
  flags,
}: TableHeadWrapperProps) {
  const { columns, paginationNeeded } = tableData;
  const setHeadRowHeight = useContextSelector(TableContext, (value) => value.setHeadRowHeight);
  const isFocusInHead = useContextSelector(TableContext, (value) => value.focusedCellCoord[0] === 0);
  const setFocusedCellCoord = useContextSelector(TableContext, (value) => value.setFocusedCellCoord);
  const headerStyle = useMemo(() => getHeaderStyle(layout, theme), [layout, theme]);
  const rtl = direction === 'rtl';
  const tableCellRefs = useRef([]);
  tableCellRefs.current = columns.map((el, i) => tableCellRefs.current[i] ?? createRef<HTMLTableElement>());
  const throttler = createThrottler(
    (event: DragEvent) => handleDragOver({ event, model, rtl, columns, setEngagedColumn }),
    100
  );
  const isDraggable = flags.isEnabled('DRAGGING_COLUMNS_IN_TABLE') ?? false;
  const headRowRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    headRowRef.current && setHeadRowHeight(headRowRef.current.getBoundingClientRect().height);
  }, [headRowRef.current, headerStyle.fontSize, headRowRef.current?.getBoundingClientRect().height]);

  useEffect(() => {
    columns.forEach((column, i) => {
      // @ts-ignore  Need check with teams how to handle store columnwidth properly
      if (tableCellRefs.current[i]!.current) {
        // @ts-ignore Need check with teams how to handle store columnwidth properly
        column.width = tableCellRefs.current[i]!.current.clientWidth;
      }
    });
  }, [tableCellRefs.current]);

  return (
    <TableHead>
      <StyledHeadRow
        ref={headRowRef}
        paginationNeeded={paginationNeeded}
        className="sn-table-row"
        onDragOver={(event: DragEvent) => throttler(event)}
      >
        {columns.map((column, columnIndex) => {
          // The first cell in the head is focusable in sequential keyboard navigation,
          // when nebula does not handle keyboard navigation
          const tabIndex = columnIndex === 0 && !keyboard.enabled ? 0 : -1;
          const isCurrentColumnActive = layout.qHyperCube.qEffectiveInterColumnSortOrder[0] === column.dataColIdx;
          const ariaSort = isCurrentColumnActive
            ? (`${column.sortDirection}ending` as 'ascending' | 'descending')
            : undefined;

          const handleKeyDown = (evt: React.KeyboardEvent) => {
            handleHeadKeyDown({
              evt,
              rootElement,
              cellCoord: [0, columnIndex],
              column,
              changeSortOrder,
              layout,
              isSortingEnabled: !constraints.active,
              setFocusedCellCoord,
            });
          };

          return (
            <TableCell
              sx={headerStyle}
              style={{ opacity: engagedColumn !== undefined && engagedColumn !== columnIndex ? '50%' : undefined }}
              ref={tableCellRefs.current[columnIndex]}
              key={column.id}
              align={column.align}
              className="sn-table-head-cell sn-table-cell"
              tabIndex={tabIndex}
              aria-sort={ariaSort}
              aria-pressed={isCurrentColumnActive}
              onKeyDown={handleKeyDown}
              onMouseDown={() => handleClickToFocusHead(columnIndex, rootElement, setFocusedCellCoord, keyboard)}
              onClick={() => !selectionsAPI.isModal() && !constraints.active && changeSortOrder(layout, column)}
              draggable={isDraggable}
              onDragStart={(event) =>
                handleDragStart({
                  event,
                  layout,
                  cellRef: tableCellRefs.current[columnIndex],
                  headRowRef,
                  cell: column,
                })
              }
              onDragEnd={(event) => handleDragEnd({ event, model, setEngagedColumn })}
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
                {column.label}
                {isFocusInHead && (
                  <VisuallyHidden data-testid={`VHL-for-col-${columnIndex}`}>
                    {translator.get('SNTable.SortLabel.PressSpaceToSort')}
                  </VisuallyHidden>
                )}
              </StyledSortLabel>
            </TableCell>
          );
        })}
      </StyledHeadRow>
    </TableHead>
  );
}

export default memo(TableHeadWrapper);
