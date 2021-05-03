import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import PropTypes from 'prop-types';
import React, { useEffect, useState, useRef } from 'react';
import TableBodyWrapper from './TableBodyWrapper';
import TableHeadWrapper from './TableHeadWrapper';
import useDidUpdateEffect from './useDidUpdateEffect';
import { updatePage } from './cells/handle-key-press';
import { handleResetFocus } from './cells/handle-cell-focus';

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
  const {
    rootElement,
    tableData,
    layout,
    setPageInfo,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    constraints,
    selectionsAPI,
  } = props;
  const { size, rows, columns } = tableData;
  const [tableWidth, setTableWidth] = useState();
  const [bodyHeight, setBodyHeight] = useState();
  const focusedCellCoord = useRef([0, 0]);
  const shouldRefocus = useRef(false);
  const classes = useStyles();
  const containerMode = constraints.active ? 'containerOverflowHidden' : 'containerOverflowAuto';
  const paginationHidden = constraints.active && 'paginationHidden';
  const paginationFixedRpp = selectionsAPI.isModal() || tableWidth < 400;
  const setShouldRefocus = () => {
    shouldRefocus.current = rootElement.getElementsByTagName('table')[0].contains(document.activeElement);
  };
  const getBodyHeight = (updatedRootElement) =>
    updatedRootElement.clientHeight - updatedRootElement.getElementsByTagName('thead')[0]?.clientHeight - 52;
  const handleChangePage = (event, newPage) => {
    setPageInfo({ top: newPage * rowsPerPage, height: rowsPerPage });
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPageInfo({ top: 0, height: +event.target.value });
    setPage(0);
  };

  useEffect(() => {
    setBodyHeight(getBodyHeight(rootElement));
  }, [layout]);

  useEffect(() => {
    const updateSize = () => {
      setTableWidth(rootElement.clientWidth);
      setBodyHeight(getBodyHeight(rootElement));
    };
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Except for first render, whenever the size of the data changes (number of rows per page, rows or columns),
  // reset tabindex to first cell. If some cell had focus, focus the first cell as well.
  useDidUpdateEffect(() => {
    handleResetFocus(focusedCellCoord, rootElement, shouldRefocus, selectionsAPI.isModal());
  }, [rows.length, size.qcy, size.qcx]);

  return (
    <Paper
      className={classes.paper}
      onKeyDown={(evt) => updatePage(evt, size.qcy, page, rowsPerPage, handleChangePage, setShouldRefocus)}
    >
      <TableContainer className={classes[containerMode]}>
        <Table stickyHeader aria-label={`showing ${rows.length + 1} rows and ${columns.length} columns`}>
          <TableHeadWrapper {...props} focusedCellCoord={focusedCellCoord} />
          <TableBodyWrapper
            {...props}
            bodyHeight={bodyHeight}
            focusedCellCoord={focusedCellCoord}
            setShouldRefocus={setShouldRefocus}
          />
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
      />
    </Paper>
  );
}

TableWrapper.propTypes = {
  rootElement: PropTypes.object.isRequired,
  tableData: PropTypes.object.isRequired,
  layout: PropTypes.object.isRequired,
  setPageInfo: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  setRowsPerPage: PropTypes.func.isRequired,
  constraints: PropTypes.object.isRequired,
  selectionsAPI: PropTypes.object.isRequired,
};
