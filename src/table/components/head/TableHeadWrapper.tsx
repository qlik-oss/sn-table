import React, { memo, useEffect, useMemo, useRef } from 'react';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import LockIcon from '@mui/icons-material/Lock';

import { useContextSelector, TableContext } from '../../context';
import { VisuallyHidden, StyledSortLabel, StyledHeadCell, HeadCellContent } from './styles';
import { getHeaderStyle } from '../../utils/styling-utils';
import { handleHeadKeyDown } from '../../utils/handle-key-press';
import {
  handleMouseDownLabelToFocusHeadCell,
  handleClickToFocusHead,
  handleClickToSort,
} from '../../utils/handle-click';
import { SortDirection } from '../../../types';
import { TableHeadWrapperProps } from '../../types';
import HeadCellMenu from './HeadCellMenu';
import CellText from '../CellText';

enum FullSortDirection {
  A = 'ascending',
  D = 'descending',
}

enum ShortSortDirection {
  A = 'asc',
  D = 'desc',
}

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
  embed,
  areBasicFeaturesEnabled,
}: TableHeadWrapperProps) {
  const { columns, totalsPosition } = tableData;
  const setHeadRowHeight = useContextSelector(TableContext, (value) => value.setHeadRowHeight);
  const isFocusInHead = useContextSelector(TableContext, (value) => value.focusedCellCoord[0] === 0);
  const setFocusedCellCoord = useContextSelector(TableContext, (value) => value.setFocusedCellCoord);
  const headerStyle = useMemo(
    () => getHeaderStyle(layout, theme, !totalsPosition.atTop),
    [layout, theme, totalsPosition]
  );
  const headRowRef = useRef<HTMLTableRowElement>(null);
  const isInteractionEnabled = !constraints.active && !selectionsAPI.isModal();

  useEffect(() => {
    headRowRef.current && setHeadRowHeight(headRowRef.current.getBoundingClientRect().height);
  }, [headRowRef.current, headerStyle.fontSize, headRowRef.current?.getBoundingClientRect().height]);

  return (
    <TableHead>
      <TableRow ref={headRowRef} className="sn-table-row">
        {columns.map((column, columnIndex) => {
          // The first cell in the head is focusable in sequential keyboard navigation,
          // when nebula does not handle keyboard navigation
          const tabIndex = columnIndex === 0 && !keyboard.enabled ? 0 : -1;
          const isCurrentColumnActive = layout.qHyperCube.qEffectiveInterColumnSortOrder[0] === column.colIdx;
          const ariaSort = isCurrentColumnActive ? FullSortDirection[column.sortDirection] : undefined;

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

          const sortFromMenu = (evt: React.MouseEvent, newSortDirection: SortDirection) => {
            evt.stopPropagation();
            changeSortOrder(column, newSortDirection);
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
              onClick={(evt: React.MouseEvent) => {
                console.log(evt);
                handleClickToSort(evt, column, changeSortOrder, isInteractionEnabled);
              }}
            >
              <HeadCellContent>
                <StyledSortLabel
                  headerStyle={headerStyle}
                  active={isCurrentColumnActive}
                  title={!constraints.passive ? FullSortDirection[column.sortDirection] : undefined} // passive: turn off tooltips.
                  direction={ShortSortDirection[column.sortDirection]}
                  tabIndex={-1}
                  onMouseDown={(evt: React.MouseEvent) =>
                    handleMouseDownLabelToFocusHeadCell(evt, rootElement, columnIndex)
                  }
                >
                  {column.isLocked && <LockIcon fontSize="small" data-testid="head-cell-lock-icon" />}
                  <CellText style={{ padding: '0px 8px' }}>{column.label}</CellText>
                  {isFocusInHead && (
                    <VisuallyHidden data-testid={`VHL-for-col-${columnIndex}`}>
                      {translator.get('SNTable.SortLabel.PressSpaceToSort')}
                    </VisuallyHidden>
                  )}
                </StyledSortLabel>

                {areBasicFeaturesEnabled && (
                  <HeadCellMenu
                    headerStyle={headerStyle}
                    translator={translator}
                    sortFromMenu={sortFromMenu}
                    embed={embed}
                    layout={layout}
                    columnIndex={columnIndex}
                    sortDirection={column.sortDirection}
                    isInteractionEnabled={isInteractionEnabled}
                    isCurrentColumnActive={isCurrentColumnActive}
                    isDimension={column.isDim}
                  />
                )}
              </HeadCellContent>
            </StyledHeadCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}

export default memo(TableHeadWrapper);
