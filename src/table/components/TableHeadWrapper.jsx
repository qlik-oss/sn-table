import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { getHeadStyle } from '../utils/styling-utils';
import { headHandleKeyPress } from '../utils/handle-key-press';
import { handleClickToFocusHead } from '../utils/handle-accessibility';

const useStyles = makeStyles({
  head: {
    color: ({ color }) => color,
    fontSize: ({ fontSize }) => fontSize,
    padding: ({ padding }) => padding,
    backgroundColor: ({ backgroundColor }) => backgroundColor,
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
  sortLabel: {
    '&.Mui-active': {
      color: 'inherit',
    },
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
  backgroundColor,
}) {
  const headStyle = useMemo(() => getHeadStyle(layout, theme), [layout, theme.name()]);
  // transparent is not allowed
  headStyle.backgroundColor = backgroundColor === 'transparent' ? 'inherent' : backgroundColor;
  const classes = useStyles(headStyle);

  return (
    <TableHead>
      <TableRow className="sn-table-row">
        {tableData.columns.map((column, columnIndex) => {
          const tabIndex = columnIndex === 0 && !keyboard.enabled ? 0 : -1;
          const isCurrentColumnActive = layout.qHyperCube.qEffectiveInterColumnSortOrder[0] === column.dataColIdx;
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
                  column,
                  changeSortOrder,
                  layout,
                  !constraints.active,
                  setFocusedCellCoord
                )
              }
              onMouseDown={() => handleClickToFocusHead(columnIndex, rootElement, setFocusedCellCoord, keyboard)}
              onClick={() => !selectionsAPI.isModal() && !constraints.active && changeSortOrder(layout, column)}
            >
              <TableSortLabel
                className={classes.sortLabel}
                active={isCurrentColumnActive}
                direction={column.sortDirection}
                tabIndex={-1}
              >
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
  backgroundColor: PropTypes.string.isRequired,
};

export default TableHeadWrapper;
