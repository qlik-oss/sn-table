import React, { memo, useEffect, useMemo, useRef } from 'react';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';

import { useContextSelector, TableContext } from '../context';
import { VisuallyHidden, StyledHeadRow, StyledSortLabel } from '../styles';
import { getHeaderStyle } from '../utils/styling-utils';
import { handleHeadKeyDown } from '../utils/handle-key-press';
import { handleMouseDownLabelToFocusHeadCell, handleClickToFocusHead } from '../utils/handle-accessibility';
import { TableHeadWrapperProps } from '../../types';

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
}: TableHeadWrapperProps) {
  const { columns, paginationNeeded } = tableData;
  const setHeadRowHeight = useContextSelector(TableContext, (value) => value.setHeadRowHeight);
  const isFocusInHead = useContextSelector(TableContext, (value) => value.focusedCellCoord[0] === 0);
  const setFocusedCellCoord = useContextSelector(TableContext, (value) => value.setFocusedCellCoord);
  const headerStyle = useMemo(() => getHeaderStyle(layout, theme), [layout, theme]);
  const headRowRef = useRef<HTMLElement>();

  useEffect(() => {
    headRowRef.current && setHeadRowHeight(headRowRef.current.getBoundingClientRect().height);
  }, [headRowRef.current, headerStyle.fontSize, headRowRef.current?.getBoundingClientRect().height]);

  return (
    <TableHead>
      <StyledHeadRow ref={headRowRef} paginationNeeded={paginationNeeded} className="sn-table-row">
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
              key={column.id}
              align={column.align}
              className="sn-table-head-cell sn-table-cell"
              tabIndex={tabIndex}
              aria-sort={ariaSort}
              aria-pressed={isCurrentColumnActive}
              onKeyDown={handleKeyDown}
              onMouseDown={() => handleClickToFocusHead(columnIndex, rootElement, setFocusedCellCoord, keyboard)}
              onClick={() => !selectionsAPI.isModal() && !constraints.active && changeSortOrder(layout, column)}
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
