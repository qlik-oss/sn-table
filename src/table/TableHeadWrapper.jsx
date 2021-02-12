import React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

export default function TableHeadWrapper({ tableData }) {
  return (
    <TableHead>
      <TableRow>
        {tableData.columns.map((column) => (
          <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
            {column.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

TableHeadWrapper.propTypes = {
  tableData: PropTypes.object.isRequired,
};
