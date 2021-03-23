import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { STYLING_DEFAULTS, getHeadStyle } from './styling-utils';
import handleKeyPress from './cells/handle-key-press';

const useStyles = makeStyles({
  head: (props) => ({
    color: props.fontColor,
    fontSize: props.fontSize,
    padding: props.padding,
    height: STYLING_DEFAULTS.HEIGHT,
    lineHeight: STYLING_DEFAULTS.HEAD_LINE_HEIGHT,
    '&&:focus': {
      boxShadow: STYLING_DEFAULTS.FOCUS_OUTLINE,
    },
  }),
});

export default function TableHeadWrapper({ rootElement, tableData, theme, layout, changeSortOrder, setFocusedCell }) {
  const classes = useStyles(getHeadStyle(layout, theme));

  return (
    <TableHead>
      <TableRow className="sn-table-row">
        {tableData.columns.map((column, columnIndex) => (
          <TableCell
            key={column.id}
            align={column.align}
            className={`${classes.head} sn-table-head-cell sn-table-cell`}
            style={{ minWidth: column.minWidth }}
            onKeyDown={(e) => handleKeyPress(e, rootElement, [0, columnIndex], setFocusedCell)}
            tabindex={-1}
          >
            <TableSortLabel
              active={layout.qHyperCube.qEffectiveInterColumnSortOrder[0] === columnIndex}
              direction={column.sortDirection}
              onClick={() => changeSortOrder(layout, column.isDim, columnIndex)}
              tabindex={-1}
            >
              {column.label}
            </TableSortLabel>
          </TableCell>
        ))}
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
  setFocusedCell: PropTypes.func.isRequired,
};
