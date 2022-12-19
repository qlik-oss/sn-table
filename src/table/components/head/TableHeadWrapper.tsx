import React, { memo, useEffect, useMemo, useRef } from 'react';
import TableHead from '@mui/material/TableHead';

import LockIcon from '@mui/icons-material/Lock';
import { useContextSelector, TableContext } from '../../context';
import { VisuallyHidden, StyledHeadRow, StyledSortLabel, StyledHeadCell, HeadCellContent } from './styles';
import { getHeaderStyle } from '../../utils/styling-utils';
import { handleHeadKeyDown } from '../../utils/handle-key-press';
import {
  handleMouseDownLabelToFocusHeadCell,
  handleClickToFocusHead,
  handleClickToSort,
} from '../../utils/handle-click';
import { TableHeadWrapperProps } from '../../types';
import HeadCellMenu from './HeadCellMenu';
import CellText from '../CellText';

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
  areBasicFeaturesEnabled,
}: TableHeadWrapperProps) {
  const { columns, paginationNeeded } = tableData;
  const setHeadRowHeight = useContextSelector(TableContext, (value) => value.setHeadRowHeight);
  const isFocusInHead = useContextSelector(TableContext, (value) => value.focusedCellCoord[0] === 0);
  const setFocusedCellCoord = useContextSelector(TableContext, (value) => value.setFocusedCellCoord);
  const headerStyle = useMemo(() => getHeaderStyle(layout, theme), [layout, theme]);
  const headRowRef = useRef<HTMLElement>();
  const isInteractionEnabled = !constraints.active && !selectionsAPI.isModal();
  const headHeight = headRowRef.current?.getBoundingClientRect().height;

  useEffect(() => {
    console.log(headHeight);
    headHeight && setHeadRowHeight(headHeight);
  }, [headRowRef.current, headerStyle.fontSize, headHeight]);

  return (
    <TableHead>
      <StyledHeadRow ref={headRowRef} paginationNeeded={paginationNeeded} className="sn-table-row">
        {columns.map((column, columnIndex) => {
          // The first cell in the head is focusable in sequential keyboard navigation,
          // when nebula does not handle keyboard navigation
          const tabIndex = columnIndex === 0 && !keyboard.enabled ? 0 : -1;
          const isCurrentColumnActive = layout.qHyperCube.qEffectiveInterColumnSortOrder[0] === column.colIdx;
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
              isInteractionEnabled,
              setFocusedCellCoord,
              areBasicFeaturesEnabled,
            });
          };

          const sortFromMenu = (evt: React.MouseEvent, sortOrder: string) => {
            evt.stopPropagation();
            changeSortOrder(column, sortOrder);
          };

          return (
            <StyledHeadCell
              headerStyle={headerStyle}
              key={column.id}
              align={column.align}
              className="sn-table-head-cell sn-table-cell"
              tabIndex={tabIndex}
              aria-sort={ariaSort}
              aria-pressed={isCurrentColumnActive}
              onKeyDown={handleKeyDown}
              onMouseDown={() => handleClickToFocusHead(columnIndex, rootElement, setFocusedCellCoord, keyboard)}
              onClick={(evt: React.MouseEvent) => handleClickToSort(evt, column, changeSortOrder, isInteractionEnabled)}
            >
              <HeadCellContent>
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
                  {column.isLocked && <LockIcon fontSize="small" data-testid="head-cell-lock-icon" />}
                  <CellText>{column.label}</CellText>
                  {isFocusInHead && (
                    <VisuallyHidden data-testid={`VHL-for-col-${columnIndex}`}>
                      {translator.get('SNTable.SortLabel.PressSpaceToSort')}
                    </VisuallyHidden>
                  )}
                </StyledSortLabel>
                {areBasicFeaturesEnabled && (
                  <HeadCellMenu headerStyle={headerStyle} translator={translator} sortFromMenu={sortFromMenu} />
                )}
              </HeadCellContent>
            </StyledHeadCell>
          );
        })}
      </StyledHeadRow>
    </TableHead>
  );
}

export default memo(TableHeadWrapper);
