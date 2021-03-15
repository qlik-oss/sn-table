import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { STYLING_DEFAULTS, getHeadStyle } from './styling-utils';

const useStyles = makeStyles({
  head: (props) => ({
    color: props.fontColor,
    fontSize: props.fontSize,
    padding: props.padding,
    height: STYLING_DEFAULTS.HEIGHT,
    lineHeight: STYLING_DEFAULTS.HEAD_LINE_HEIGHT,
  }),
});

export default function TableHeadWrapper({ tableData, theme, layout, changeSortOrder }) {
  const classes = useStyles(getHeadStyle(layout, theme));

  return (
    <TableHead>
      <TableRow>
        {tableData.columns.map((column, idx) => (
          <TableCell
            key={column.id}
            align={column.align}
            className={classes.head}
            style={{ minWidth: column.minWidth }}
          >
            <TableSortLabel
              active={layout.qHyperCube.qEffectiveInterColumnSortOrder[0] === idx}
              direction={column.sortDirection}
              onClick={() => changeSortOrder(column.isDim, idx)}
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
  tableData: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  layout: PropTypes.object.isRequired,
  changeSortOrder: PropTypes.func.isRequired,
};
