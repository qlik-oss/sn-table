import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableHeadWrapper from './TableHeadWrapper';
import TableBodyWrapper from './TableBodyWrapper';
import { focusCell } from './cells/handle-key-press';

const useStyles = makeStyles({
  paper: {
    height: '100%',
  },
  containerOverflowAuto: {
    overflow: 'auto',
  },
  containerOverflowHidden: {
    overflow: 'hidden',
  },
  paginationHidden: {
    display: 'none',
  },
});

export default function TableWrapper(props) {
  const { rootElement, tableData, setPageInfo, constraints, selectionsAPI, a11y } = props;
  const { size, rows } = tableData;
  const [tableWidth, setTableWidth] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [focusedCell, setFocusedCell] = useState([]);
  const classes = useStyles();
  const containerMode = constraints.active ? 'containerOverflowHidden' : 'containerOverflowAuto';
  const paginationHidden = constraints.active && 'paginationHidden';
  const paginationFixedRpp = selectionsAPI.isModal() || tableWidth < 400;
  const paginationTabindex = a11y.focus ? 0 : -1;

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

  if (!rows.length && page > 0) {
    handleChangePage(null, 0);
    return null;
  }

  useEffect(() => {
    const updateSize = () => setTableWidth(rootElement.clientWidth);
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (a11y.focus) {
      focusCell(rootElement.getElementsByClassName('sn-table-row'), focusedCell.length ? focusedCell : [0, 0]);
    }
  }, [a11y]);

  // refocus after
  useEffect(() => {
    if (a11y.focus && focusedCell.length) {
      focusCell(rootElement.getElementsByClassName('sn-table-row'), focusedCell);
    }
  }, [tableData]);

  return (
    <Paper className={classes.paper}>
      <TableContainer className={classes[containerMode]}>
        <Table stickyHeader aria-label="sticky table">
          <TableHeadWrapper {...props} setFocusedCell={setFocusedCell} />
          <TableBodyWrapper {...props} setFocusedCell={setFocusedCell} />
        </Table>
      </TableContainer>
      <TablePagination
        className={classes[paginationHidden]}
        rowsPerPageOptions={paginationFixedRpp ? [rowsPerPage] : [10, 25, 100]}
        component="div"
        count={size.qcy}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        SelectProps={{ inputProps: { tabIndex: paginationTabindex } }}
        backIconButtonProps={{ tabIndex: paginationTabindex }}
        nextIconButtonProps={{ tabIndex: paginationTabindex }}
      />
    </Paper>
  );
}

TableWrapper.propTypes = {
  rootElement: PropTypes.object.isRequired,
  tableData: PropTypes.object.isRequired,
  setPageInfo: PropTypes.func.isRequired,
  constraints: PropTypes.object.isRequired,
  selectionsAPI: PropTypes.object.isRequired,
  a11y: PropTypes.object.isRequired,
};
