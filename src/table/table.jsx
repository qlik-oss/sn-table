import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

export default function TableWrapper(props) {
  const { tableData, setPageInfo } = props;
  const { size, rows, columns } = tableData;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);

  const handleChangePage = (event, newPage) => {
    setPageInfo({ top: newPage * rowsPerPage, height: rowsPerPage });
    setPage(newPage);
  };

  // should trigger reload
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPageInfo({ top: 0, height: +event.target.value });
    setPage(0);
  };

  return (
    <Paper>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                {columns.map((column) => {
                  const cell = row[column.id];
                  const value = cell.qText;
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {value}
                    </TableCell>
                  );
                  // const CellRenderer = columnRenderers[i];
                  // return CellRenderer ? (
                  //   <CellRenderer cell={cell} column={column} value={value} key={column.id} align={column.align}>
                  //     {value}
                  //   </CellRenderer>
                  // ) : (
                  //   <TableCell key={column.id} align={column.align}>
                  //     {value}
                  //   </TableCell>
                  // );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={size.qcy}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

TableWrapper.propTypes = {
  tableData: PropTypes.object.isRequired,
  setPageInfo: PropTypes.func.isRequired,
  // columnRenderers: PropTypes.array.isRequired,
};
