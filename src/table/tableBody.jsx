import React from 'react';
import PropTypes from 'prop-types';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

export default function TableBodyWrapper({ tableData, columnRenderers, selections }) {
  const { rows, columns } = tableData;

  return (
    <TableBody>
      {rows.map((row) => (
        <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
          {columns.map((column, i) => {
            const cell = row[column.id];
            const value = cell.qText;
            const CellRenderer = columnRenderers[i];
            return CellRenderer ? (
              <CellRenderer
                cell={cell}
                column={column}
                value={value}
                key={column.id}
                align={column.align}
                selections={selections}
              >
                {value}
              </CellRenderer>
            ) : (
              <TableCell key={column.id} align={column.align}>
                {value}
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </TableBody>
  );
}

TableBodyWrapper.propTypes = {
  tableData: PropTypes.object.isRequired,
  columnRenderers: PropTypes.array.isRequired,
  selections: PropTypes.object.isRequired,
};
