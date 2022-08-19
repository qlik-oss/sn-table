import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useContextSelector, TableContext } from '../context';
import { getTotalsCellStyle } from '../utils/styling-utils';
import { totalHandleKeyPress } from '../utils/handle-key-press';
import { removeAndFocus } from '../utils/handle-accessibility';
import { StyledHeadRow, StyledTotalsCell } from '../styles';

function TableTotals({ rootElement, tableData, theme, layout, keyboard, engagedColumn }) {
  const { columns, paginationNeeded, totalsPosition, rows } = tableData;
  const headRowHeight = useContextSelector(TableContext, (value) => value.headRowHeight);
  const setFocusedCellCoord = useContextSelector(TableContext, (value) => value.setFocusedCellCoord);
  const totalsStyle = useMemo(() => getTotalsCellStyle(layout, theme), [layout, theme.name()]);
  const isTop = totalsPosition === 'top';

  return (
    <StyledHeadRow paginationNeeded={paginationNeeded} className="sn-table-row">
      {columns.map((column, columnIndex) => {
        const cellCoord = [isTop ? 1 : rows.length + 1, columnIndex];
        return (
          <StyledTotalsCell
            totalsStyle={totalsStyle}
            style={{ opacity: engagedColumn !== undefined && engagedColumn !== columnIndex ? '50%' : null }}
            headRowHeight={headRowHeight}
            isTop={isTop}
            key={column.id}
            align={column.align}
            className="sn-table-cell"
            tabIndex={-1}
            onKeyDown={(e) => {
              totalHandleKeyPress(e, rootElement, cellCoord, setFocusedCellCoord);
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

TableTotals.defaultProps = {
  engagedColumn: undefined,
};

TableTotals.propTypes = {
  rootElement: PropTypes.object.isRequired,
  tableData: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  layout: PropTypes.object.isRequired,
  keyboard: PropTypes.object.isRequired,
  engagedColumn: PropTypes.number,
};

export default memo(TableTotals);
