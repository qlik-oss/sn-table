import React, { memo, useEffect, useRef } from 'react';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { useContextSelector, TableContext } from '../../context';
import { TableHeadWrapperProps } from '../../types';
import { DEFAULT_COLUMN_PIXEL_WIDTH, FullSortDirection } from '../../constants';
import { StyledHeadCell } from './styles';
import HeadCellContent from './HeadCellContent';
import ColumnAdjuster from './ColumnAdjuster';
import { BORDER_WIDTH, PADDING } from '../../styling-defaults';

function TableHeadWrapper({ areBasicFeaturesEnabled }: TableHeadWrapperProps) {
  const { columns } = useContextSelector(TableContext, (value) => value.tableData);
  const { layout, styling } = useContextSelector(TableContext, (value) => value.baseProps);
  const setHeadRowHeight = useContextSelector(TableContext, (value) => value.setHeadRowHeight);
  const columnWidths = useContextSelector(TableContext, (value) => value.columnWidths);
  const headRowRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    headRowRef.current && setHeadRowHeight(headRowRef.current.getBoundingClientRect().height);
  }, [headRowRef.current, styling.head.fontSize, headRowRef.current?.getBoundingClientRect().height]);

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
              width:
                (columnWidths[columnIndex] || DEFAULT_COLUMN_PIXEL_WIDTH) -
                (isLastColumn ? PADDING * 2 : PADDING * 2 + BORDER_WIDTH),
              zIndex: columns.length - columnIndex,
            }),
          };

          return (
            <StyledHeadCell
              headerStyle={{ ...styling.head, ...widthStyle }}
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
