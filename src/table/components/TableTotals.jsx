import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useContextSelector, TableContext } from '../context';
import { getHeaderStyle, getBodyCellStyle } from '../utils/styling-utils';
import { totalHandleKeyPress } from '../utils/handle-key-press';
import { removeAndFocus } from '../utils/handle-accessibility';
import { StyledHeadRow, TotalsCell } from '../styles';

function TableTotals({ rootElement, tableData, theme, layout, keyboard, height }) {
  const { columns, paginationNeeded, totalsPosition, rows } = tableData;
  const setFocusedCellCoord = useContextSelector(TableContext, (value) => value.setFocusedCellCoord);
  const headerStyle = useMemo(() => getHeaderStyle(layout, theme), [layout, theme.name()]);
  const bodyCellStyle = useMemo(() => getBodyCellStyle(layout, theme), [layout, theme.name()]);
  const isTop = totalsPosition === 'top';

  return (
    <StyledHeadRow paginationNeeded={paginationNeeded} className="sn-table-row">
      {columns.map((column, columnIndex) => {
        const cellCoord = [isTop ? 1 : rows.length + 1, columnIndex];
        return (
          <TotalsCell
            headerStyle={headerStyle}
            bodyCellStyle={bodyCellStyle}
            headCellHeight={height}
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
          </TotalsCell>
        );
      })}
    </StyledHeadRow>
  );
}

TableTotals.defaultProps = {
  height: undefined,
};

TableTotals.propTypes = {
  rootElement: PropTypes.object.isRequired,
  tableData: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  layout: PropTypes.object.isRequired,
  keyboard: PropTypes.object.isRequired,
  height: PropTypes.number,
};

export default memo(TableTotals);
