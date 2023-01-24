import React, { memo, useEffect, useMemo, useRef } from 'react';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { useContextSelector, TableContext } from '../../context';
import { getHeaderStyle } from '../../utils/styling-utils';
// import { handleHeadKeyDown } from '../../utils/handle-key-press';
// import {
//   handleMouseDownLabelToFocusHeadCell,
//   handleClickToFocusHead,
//   handleClickToSort,
// } from '../../utils/handle-click';
import { TableHeadWrapperProps } from '../../types';
import { FullSortDirection } from '../../constants';
import { StyledHeadCell } from './styles';
import HeadCellContent from './HeadCellContent';

function TableHeadWrapper({ tableData, changeSortOrder, areBasicFeaturesEnabled }: TableHeadWrapperProps) {
  const { columns, totalsPosition } = tableData;
  const { layout, theme } = useContextSelector(TableContext, (value) => value.baseProps);
  const setHeadRowHeight = useContextSelector(TableContext, (value) => value.setHeadRowHeight);
  // const setFocusedCellCoord = useContextSelector(TableContext, (value) => value.setFocusedCellCoord);
  const headerStyle = useMemo(
    () => getHeaderStyle(layout, theme, !totalsPosition.atTop),
    [layout, theme, totalsPosition]
  );
  const headRowRef = useRef<HTMLTableRowElement>(null);

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
                changeSortOrder={changeSortOrder}
                // isCurrentColumnActive={isCurrentColumnActive}
                areBasicFeaturesEnabled={areBasicFeaturesEnabled}
              />
            </StyledHeadCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}

export default memo(TableHeadWrapper);
