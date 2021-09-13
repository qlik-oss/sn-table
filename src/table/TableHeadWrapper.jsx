import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { getHeadStyle } from './styling-utils';
import { headHandleKeyPress } from './cells/handle-key-press';
import { handleClickToFocusHead } from './cells/handle-cell-focus';

const useStyles = makeStyles({
  head: {
    color: ({ color }) => color,
    fontSize: ({ fontSize }) => fontSize,
    padding: ({ padding }) => padding,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
});

const SORT_NOTATIONS = {
  asc: 'Sorted ascending',
  desc: 'Sorted descending',
};

export default function TableHeadWrapper({
  rootElement,
  tableData,
  theme,
  layout,
  changeSortOrder,
  constraints,
  selectionsAPI,
  focusedCellCoord,
}) {
  const headStyle = useMemo(() => getHeadStyle(layout, theme), [layout, theme.name()]);
  const classes = useStyles(headStyle);
  const canSortTable = !selectionsAPI.isModal() && !constraints.active;

  return (
    <TableHead>
      <TableRow className="sn-table-row">
        {tableData.columns.map((column, columnIndex) => {
          const tabIndex = columnIndex === 0 ? '0' : '-1';
          const currentSortDir = SORT_NOTATIONS[column.sortDirection];
          const isTableSortActive = layout.qHyperCube.qEffectiveInterColumnSortOrder[0] === columnIndex;

          return (
            <TableCell
              key={column.id}
              align={column.align}
              className={`${classes.head} sn-table-head-cell sn-table-cell`}
              tabIndex={tabIndex}
              role="button"
              aria-sort={column.sortDirection}
              aria-pressed={isTableSortActive}
              onKeyDown={(e) =>
                headHandleKeyPress(
                  e,
                  rootElement,
                  [0, columnIndex],
                  focusedCellCoord,
                  changeSortOrder,
                  layout,
                  column.isDim,
                  !constraints.active
                )
              }
              onMouseDown={() => handleClickToFocusHead(columnIndex, focusedCellCoord, rootElement)}
              onClick={() => canSortTable && changeSortOrder(layout, column.isDim, columnIndex)}
            >
              <TableSortLabel active={isTableSortActive} direction={column.sortDirection} tabIndex={-1}>
                {column.label}
                <span className={classes.visuallyHidden}>{currentSortDir}, Press space to sort on this column.</span>
              </TableSortLabel>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}

TableHeadWrapper.propTypes = {
  rootElement: PropTypes.object.isRequired,
  tableData: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  layout: PropTypes.object.isRequired,
  changeSortOrder: PropTypes.func.isRequired,
  constraints: PropTypes.object.isRequired,
  focusedCellCoord: PropTypes.object.isRequired,
  selectionsAPI: PropTypes.object.isRequired,
};
