import React, { memo, useEffect, useMemo, useRef } from 'react';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { useContextSelector, TableContext } from '../../context';
import { getHeaderStyle } from '../../utils/styling-utils';
// import { handleHeadKeyDown } from '../../utils/handle-key-press';
// import { handleClickToFocusHead, handleClickToSort } from '../../utils/handle-click';
import { TableHeadWrapperProps } from '../../types';
import { FullSortDirection } from '../../constants';
import { StyledHeadCell } from './styles';
import HeadCellContent from './HeadCellContent';

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
  // const setFocusedCellCoord = useContextSelector(TableContext, (value) => value.setFocusedCellCoord);
  const headerStyle = useMemo(
    () => getHeaderStyle(layout, theme, !totalsPosition.atTop),
    [layout, theme, totalsPosition]
  );
  const headRowRef = useRef<HTMLTableRowElement>(null);
  const isInteractionEnabled = !constraints.active && !selectionsAPI.isModal();
  const tabIndex = !keyboard.enabled ? 0 : -1;

  useEffect(() => {
    headRowRef.current && setHeadRowHeight(headRowRef.current.getBoundingClientRect().height);
  }, [headRowRef.current, headerStyle.fontSize, headRowRef.current?.getBoundingClientRect().height]);

  return (
    <TableHead>
      <TableRow ref={headRowRef} className="sn-table-row">
        {columns.map((column, columnIndex) => {
          // The first cell in the head is focusable in sequential keyboard navigation,
          // when nebula does not handle keyboard navigation
          const isCurrentColumnActive = layout.qHyperCube.qEffectiveInterColumnSortOrder[0] === column.colIdx;
          const ariaSort = isCurrentColumnActive ? FullSortDirection[column.sortDirection] : undefined;

          // const handleKeyDown = (evt: React.KeyboardEvent) => {
          //   handleHeadKeyDown({
          //     evt,
          //     rootElement,
          //     cellCoord: [0, columnIndex],
          //     column,
          //     changeSortOrder,
          //     isInteractionEnabled,
          //     setFocusedCellCoord,
          //     areBasicFeaturesEnabled,
          //   });
          // };

          return (
            <StyledHeadCell
              headerStyle={headerStyle}
              key={column.id}
              align={column.align}
              className="sn-table-head-cell sn-table-cell"
              aria-sort={ariaSort}
            >
              <HeadCellContent
                column={column}
                columnIndex={columnIndex}
                constraints={constraints}
                headerStyle={headerStyle}
                translator={translator}
                embed={embed}
                layout={layout}
                isCurrentColumnActive={isCurrentColumnActive}
                isFocusInHead={isFocusInHead}
                areBasicFeaturesEnabled={areBasicFeaturesEnabled}
                isInteractionEnabled={isInteractionEnabled}
                changeSortOrder={changeSortOrder}
                tabIndex={tabIndex}
              />
            </StyledHeadCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}

export default memo(TableHeadWrapper);
