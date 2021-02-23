import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { getHeadStyle } from './styling-utils';

const useStyles = makeStyles({
  head: (props) => ({
    color: props.fontColor,
    fontSize: props.fontSize,
    padding: props.padding,
    height: 'auto',
    lineHeight: '150%',
  }),
});

export default function TableHeadWrapper({ tableData, theme, layout }) {
  const classes = useStyles(getHeadStyle(layout, theme));

  return (
    <TableHead>
      <TableRow>
        {tableData.columns.map((column) => (
          <TableCell
            key={column.id}
            align={column.align}
            className={classes.head}
            style={{ minWidth: column.minWidth }}
          >
            {column.label}
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
};
