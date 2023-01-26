import React, { memo, useEffect, useMemo, useRef } from 'react';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { useContextSelector, TableContext } from '../../context';
import { getHeaderStyle } from '../../utils/styling-utils';
import { TableHeadWrapperProps } from '../../types';
import { FullSortDirection } from '../../constants';
import { StyledHeadCell } from './styles';
import HeadCellContent from './HeadCellContent';

function TableHeadWrapper({ tableData, areBasicFeaturesEnabled }: TableHeadWrapperProps) {
  const { columns, totalsPosition } = tableData;
  const { layout, theme } = useContextSelector(TableContext, (value) => value.baseProps);
  const setHeadRowHeight = useContextSelector(TableContext, (value) => value.setHeadRowHeight);
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
                isActive={isActive}
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
