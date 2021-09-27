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
  tableHeadBtn: {
    all: 'unset',
    width: '100%',
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

function TableHeadWrapper({
  rootElement,
  tableData,
  theme,
  layout,
  changeSortOrder,
  constraints,
  selectionsAPI,
  setfocusedCellCoord,
}) {
  const headStyle = useMemo(() => getHeadStyle(layout, theme), [layout, theme.name()]);
  const classes = useStyles(headStyle);

  return (
    <TableHead>
      <TableRow className="sn-table-row">
        {tableData.columns.map((column, columnIndex) => {
          const tabIndex = columnIndex === 0 ? '0' : '-1';
          const currentSortDir = SORT_NOTATIONS[column.sortDirection];
          const isCurrentColumnActive = layout.qHyperCube.qEffectiveInterColumnSortOrder[0] === columnIndex;

          return (
            <TableCell
              key={column.id}
              align={column.align}
              className={`${classes.head} sn-table-head-cell sn-table-cell`}
              tabIndex={tabIndex}
              scope="col"
              aria-sort={isCurrentColumnActive ? `${column.sortDirection}ending` : null}
              onKeyDown={(e) =>
                headHandleKeyPress(
                  e,
                  rootElement,
                  [0, columnIndex],
                  changeSortOrder,
                  layout,
                  column.isDim,
                  !constraints.active,
                  setfocusedCellCoord
                )
              }
              onMouseDown={() => handleClickToFocusHead(columnIndex, rootElement, setfocusedCellCoord)}
              onClick={() =>
                !selectionsAPI.isModal() && !constraints.active && changeSortOrder(layout, column.isDim, columnIndex)
              }
            >
              {/* <button type="button" className={classes.tableHeadBtn} tabIndex={isCurrentColumnActive ? '1' : '-1'}> */}
              <TableSortLabel active={isCurrentColumnActive} direction={column.sortDirection} tabIndex={-1}>
                {column.label}
                {/* <span className={classes.visuallyHidden} data-testid={`VHL-for-col-${columnIndex}`}>
                    {isCurrentColumnActive && `${currentSortDir}. `}
                    Press space to sort on this column.
                  </span> */}
              </TableSortLabel>
              {/* </button> */}
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
  selectionsAPI: PropTypes.object.isRequired,
  setfocusedCellCoord: PropTypes.func.isRequired,
};

export default TableHeadWrapper;
