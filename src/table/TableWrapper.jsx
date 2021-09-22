import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import PropTypes from 'prop-types';
import React, { useEffect, useState, useRef } from 'react';
import TableBodyWrapper from './TableBodyWrapper';
import TableHeadWrapper from './TableHeadWrapper';
import useDidUpdateEffect from './useDidUpdateEffect';
import { updatePage } from './cells/handle-key-press';
import { handleResetFocus, handleNavigateTop } from './cells/handle-cell-focus';
import handleScroll from './handle-scroll';

const useStyles = makeStyles({
  paper: {
    height: '100%',
  },
  containerOverflowAuto: {
    height: 'calc(100% - 52px)',
    overflow: 'auto',
  },
  containerOverflowHidden: {
    height: '100%',
    overflow: 'hidden',
  },
  paginationHidden: {
    display: 'none',
  },
});

export default function TableWrapper(props) {
  const { rootElement, tableData, setPageInfo, constraints, selectionsAPI } = props;
  const { size, rows, columns } = tableData;
  const [tableWidth, setTableWidth] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [focusedCellCoord, setfocusedCellCoord] = useState([0, 0]);
  const shouldRefocus = useRef(false);
  const tableSection = useRef();
  const classes = useStyles();
  const containerMode = constraints.active ? 'containerOverflowHidden' : 'containerOverflowAuto';
  const paginationHidden = constraints.active && 'paginationHidden';
  const paginationFixedRpp = selectionsAPI.isModal() || tableWidth < 400;
  const setShouldRefocus = () => {
    shouldRefocus.current = rootElement.getElementsByTagName('table')[0].contains(document.activeElement);
  };

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
    tableSection.current?.addEventListener('wheel', (evt) => handleScroll(evt, tableSection));
    return () => {
      window.removeEventListener('resize', updateSize);
      tableSection.current.removeEventListener('wheel', (evt) => handleScroll(evt, tableSection));
    };
  }, []);

  useEffect(() => {
    handleNavigateTop({
      tableSection,
      focusedCellCoord,
      rootElement,
    });
  }, [tableSection, focusedCellCoord]);

  // Except for first render, whenever the size of the data changes (number of rows per page, rows or columns),
  // reset tabindex to first cell. If some cell had focus, focus the first cell as well.
  useDidUpdateEffect(() => {
    handleResetFocus({
      focusedCellCoord,
      rootElement,
      shouldRefocus,
      setfocusedCellCoord,
      hasSelections: selectionsAPI.isModal(),
    });
  }, [rows.length, size.qcy, size.qcx, page]);

  return (
    <Paper
      className={classes.paper}
      onKeyDown={(evt) =>
        updatePage({
          evt,
          totalRowSize: size.qcy,
          page,
          rowsPerPage,
          handleChangePage,
          setShouldRefocus,
        })
      }
    >
      <TableContainer ref={tableSection} className={classes[containerMode]}>
        <Table stickyHeader aria-label={`showing ${rows.length + 1} rows and ${columns.length} columns`}>
          <TableHeadWrapper {...props} setfocusedCellCoord={setfocusedCellCoord} />
          <TableBodyWrapper {...props} setfocusedCellCoord={setfocusedCellCoord} setShouldRefocus={setShouldRefocus} />
        </Table>
      </TableContainer>
      <TablePagination
        className={classes[paginationHidden]}
        rowsPerPageOptions={paginationFixedRpp ? [rowsPerPage] : [10, 25, 100]}
        component="div"
        count={size.qcy}
        rowsPerPage={rowsPerPage}
        page={page}
        SelectProps={{
          inputProps: { 'aria-label': 'rows per page', 'data-testid': 'select' },
          native: true,
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
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
};
