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

function TableHeadWrapper({ tableData, changeSortOrder, areBasicFeaturesEnabled }: TableHeadWrapperProps) {
  const { columns, totalsPosition } = tableData;
  const { layout, theme, constraints, selectionsAPI, rootElement, keyboard, translator } = useContextSelector(
    TableContext,
    (value) => value.baseProps
  );
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

                {areBasicFeaturesEnabled && <HeadCellMenu columnIndex={columnIndex} isDimension={column.isDim} />}
              </HeadCellContent>
            </StyledHeadCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}

export default memo(TableHeadWrapper);
