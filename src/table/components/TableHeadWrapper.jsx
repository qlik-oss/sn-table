import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { getHeadStyle } from '../utils/styling-utils';
import { headHandleKeyPress } from '../utils/handle-key-press';
import { handleClickToFocusHead } from '../utils/handle-accessibility';

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
  translator,
  selectionsAPI,
  focusedCellCoord,
  setFocusedCellCoord,
  keyboard,
}) {
  const headStyle = useMemo(() => getHeadStyle(layout, theme), [layout, theme.name()]);
  const classes = useStyles(headStyle);

  return (
    <TableHead>
      <TableRow className="sn-table-row">
        {tableData.columns.map((column, columnIndex) => {
          const tabIndex = columnIndex === 0 && !keyboard.enabled ? '0' : '-1';
          const isCurrentColumnActive =
            layout.qHyperCube.qEffectiveInterColumnSortOrder[0] === tableData.columnOrder[columnIndex];
          const isFocusInHead = focusedCellCoord[0] === 0;

          return (
            <TableCell
              key={column.id}
              align={column.align}
              className={`${classes.head} sn-table-head-cell sn-table-cell`}
              tabIndex={tabIndex}
              aria-sort={isCurrentColumnActive ? `${column.sortDirection}ending` : null}
              aria-pressed={isCurrentColumnActive}
              onKeyDown={(e) =>
                headHandleKeyPress(
                  e,
                  rootElement,
                  [0, columnIndex],
                  changeSortOrder,
                  layout,
                  column.isDim,
                  !constraints.active,
                  setFocusedCellCoord
                )
              }
              onMouseDown={() => handleClickToFocusHead(columnIndex, rootElement, setFocusedCellCoord, keyboard)}
              onClick={() =>
                !selectionsAPI.isModal() && !constraints.active && changeSortOrder(layout, column.isDim, columnIndex)
              }
            >
              <TableSortLabel active={isCurrentColumnActive} direction={column.sortDirection} tabIndex={-1}>
                {column.label}
                {isFocusInHead && (
                  <span className={classes.visuallyHidden} data-testid={`VHL-for-col-${columnIndex}`}>
                    {translator.get('SNTable.SortLabel.PressSpaceToSort')}
                  </span>
                )}
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
  selectionsAPI: PropTypes.object.isRequired,
  keyboard: PropTypes.object.isRequired,
  focusedCellCoord: PropTypes.arrayOf(PropTypes.number).isRequired,
  setFocusedCellCoord: PropTypes.func.isRequired,
  translator: PropTypes.object.isRequired,
};

export default TableHeadWrapper;
