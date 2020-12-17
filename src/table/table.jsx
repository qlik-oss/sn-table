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
import handleCellKeyDown from './cells/handle-cell-key-down';

export default function TableWrapper(props) {
  const { tableData, setPageInfo, columnRenderers, rootElement } = props;
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
    setPageInfo({ top: 0, height: rowsPerPage });
    setPage(0);
  };

  return (
    <Paper>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table" className="sn-table">
          <TableHead>
            <TableRow className="sn-table-row">
              {columns.map((column, j) => {
                // TODO replace with proper place to start focus
                const tabIndex = j === 0 ? '0' : '-1';
                return (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    className="sn-table-cell"
                    tabIndex={tabIndex}
                    onKeyDown={(e) => handleCellKeyDown(e, rootElement, 0, j)}
                  >
                    {column.label}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code} className="sn-table-row">
                  {columns.map((column, j) => {
                    const cell = row[column.id];
                    const value = cell.qText;
                    const CellRenderer = columnRenderers[j];
                    return CellRenderer ? (
                      <CellRenderer
                        cell={cell}
                        column={column}
                        value={value}
                        key={column.id}
                        align={column.align}
                        tabIndex={-1}
                        onKeyDown={(e) => handleCellKeyDown(e, rootElement, i + 1, j)}
                        className="sn-table-cell"
                      >
                        {value}
                      </CellRenderer>
                    ) : (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        onKeyDown={(e) => handleCellKeyDown(e, rootElement, i + 1, j)}
                        tabIndex={-1}
                        className="sn-table-cell"
                      >
                        {value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
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
  columnRenderers: PropTypes.array.isRequired,
  rootElement: PropTypes.element.isRequired,
};
