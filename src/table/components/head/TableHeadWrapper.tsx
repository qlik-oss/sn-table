import React, { memo, useEffect, useMemo, useRef } from 'react';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { useContextSelector, TableContext } from '../../context';
import { getHeaderStyle } from '../../utils/styling-utils';
import { TableHeadWrapperProps } from '../../types';
import { FullSortDirection } from '../../constants';
import { StyledHeadCell } from './styles';
import HeadCellContent from './HeadCellContent';
import ColumnAdjuster from './ColumnAdjuster';

function TableHeadWrapper({ tableData, areBasicFeaturesEnabled }: TableHeadWrapperProps) {
  const { columns, totalsPosition } = tableData;
  const { layout, theme } = useContextSelector(TableContext, (value) => value.baseProps);
  const setHeadRowHeight = useContextSelector(TableContext, (value) => value.setHeadRowHeight);
  const columnWidths = useContextSelector(TableContext, (value) => value.columnWidths);
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
          const isActive = layout.qHyperCube.qEffectiveInterColumnSortOrder[0] === column.colIdx;
          const ariaSort = isActive ? FullSortDirection[column.sortDirection] : undefined;
          const isLastColumn = columnIndex === columns.length - 1;

          const widthStyle = {
            ...(areBasicFeaturesEnabled && {
              width: (columnWidths[columnIndex] || 200) - (isLastColumn ? 8 : 9), // subtract padding and border
              zIndex: columns.length - columnIndex,
            }),
          };

          return (
            <StyledHeadCell
              headerStyle={{ ...headerStyle, ...widthStyle }}
              key={column.id}
              align={column.align}
              className="sn-table-head-cell sn-table-cell"
              aria-sort={ariaSort}
            >
              <HeadCellContent
                column={column}
                columnIndex={columnIndex}
                isActive={isActive}
                areBasicFeaturesEnabled={areBasicFeaturesEnabled}
              />
              {areBasicFeaturesEnabled && <ColumnAdjuster column={column} isLastColumn={isLastColumn} />}
            </StyledHeadCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}

export default memo(TableHeadWrapper);
