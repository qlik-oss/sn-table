import React, { useMemo, memo } from 'react';
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

function TableHeadWrapper({
  rootElement,
  tableData,
  theme,
  layout,
  changeSortOrder,
  constraints,
  selectionsAPI,
  focusedCellCoord,
  handleFocusedCellCordsUpd,
}) {
  const headStyle = useMemo(() => getHeadStyle(layout, theme), [layout, theme.name()]);
  const classes = useStyles(headStyle);

  return (
    <TableHead>
      <TableRow className="sn-table-row">
        {tableData.columns.map((column, columnIndex) => {
          const tabIndex = columnIndex === 0 ? '0' : '-1';
          return (
            <TableCell
              key={column.id}
              align={column.align}
              className={`${classes.head} sn-table-head-cell sn-table-cell`}
              tabIndex={tabIndex}
              onKeyDown={(e) =>
                headHandleKeyPress(
                  e,
                  rootElement,
                  [0, columnIndex],
                  changeSortOrder,
                  layout,
                  column.isDim,
                  !constraints.active,
                  handleFocusedCellCordsUpd
                )
              }
              onMouseDown={() => handleClickToFocusHead(columnIndex, focusedCellCoord, rootElement)}
            >
              <TableSortLabel
                active={layout.qHyperCube.qEffectiveInterColumnSortOrder[0] === columnIndex}
                direction={column.sortDirection}
                onClick={() =>
                  // when cells are selected or in edit mode, it should not be able to do the sorting
                  !selectionsAPI.isModal() && !constraints.active && changeSortOrder(layout, column.isDim, columnIndex)
                }
                tabIndex={-1}
              >
                {column.label}
                {layout.qHyperCube.qEffectiveInterColumnSortOrder[0] === columnIndex ? (
                  <span className={classes.visuallyHidden}>
                    {column.sortDirection === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
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
  focusedCellCoord: PropTypes.arrayOf(PropTypes.number),
  selectionsAPI: PropTypes.object.isRequired,
};

export default memo(
  TableHeadWrapper,
  (prevProps, nextProps) => prevProps.focusedCellCoord.toString() !== nextProps.focusedCellCoord.toString()
);
