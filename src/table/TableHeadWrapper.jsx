import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
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

export default function TableHeadWrapper({ rootElement, tableData, theme, layout }) {
  const classes = useStyles(getHeadStyle(layout, theme));
  const { rows, columns } = tableData;

  return (
    <TableHead>
      <TableRow className="sn-table-row">
        {columns.map((column, columnIndex) => {
          const tabIndex = columnIndex === 0 ? '0' : '-1';
          return (
            <TableCell
              key={column.id}
              align={column.align}
              className={`${classes.head} sn-table-head-cell sn-table-cell`}
              style={{ minWidth: column.minWidth }}
              tabIndex={tabIndex}
              onKeyDown={(e) => handleKeyPress(e, rootElement, rows, 0, columnIndex, column.id)}
            >
              {column.label}
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
};
