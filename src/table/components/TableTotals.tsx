import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useContextSelector, TableContext } from '../context';
import { getTotalsCellStyle } from '../utils/styling-utils';
import { handleTotalKeyDown } from '../utils/handle-key-press';
import { removeAndFocus } from '../utils/handle-accessibility';
import { StyledHeadRow, StyledTotalsCell } from '../styles';
import { TableTotalsProps } from '../../types';

function TableTotals({ rootElement, tableData, theme, layout, keyboard }: TableTotalsProps) {
  const { columns, paginationNeeded, totalsPosition, rows } = tableData;
  const headRowHeight = useContextSelector(TableContext, (value) => value.headRowHeight);
  const setFocusedCellCoord = useContextSelector(TableContext, (value) => value.setFocusedCellCoord);
  const totalsStyle = useMemo(() => getTotalsCellStyle(layout, theme), [layout, theme.name()]);
  const isTop = totalsPosition === 'top';

  return (
    <StyledHeadRow paginationNeeded={paginationNeeded} className="sn-table-row">
      {columns.map((column, columnIndex) => {
        const cellCoord: [number, number] = [isTop || !rows ? 1 : rows.length + 1, columnIndex];
        return (
          <StyledTotalsCell
            totalsStyle={totalsStyle}
            headRowHeight={headRowHeight}
            isTop={isTop}
            key={column.id}
            align={column.align}
            className="sn-table-cell"
            tabIndex={-1}
            onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
              handleTotalKeyDown(e, rootElement, cellCoord, setFocusedCellCoord);
            }}
            onMouseDown={() => {
              removeAndFocus(cellCoord, rootElement, setFocusedCellCoord, keyboard);
            }}
          >
            {column.totalInfo}
          </StyledTotalsCell>
        );
      })}
    </StyledHeadRow>
  );
}

TableTotals.propTypes = {
  rootElement: PropTypes.object.isRequired,
  tableData: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  layout: PropTypes.object.isRequired,
  keyboard: PropTypes.object.isRequired,
};

export default memo(TableTotals);
