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
import { handleWrapperKeyDown } from './cells/handle-key-press';
import { updateFocus, handleResetFocus } from './cells/handle-cell-focus';
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
  const { rootElement, tableData, setPageInfo, constraints, selectionsAPI, keyboard } = props;
  const { size, rows, columns } = tableData;
  const [tableWidth, setTableWidth] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const focusedCellCoord = useRef([0, 0]);
  const shouldRefocus = useRef(false);
  const tableSection = useRef();
  const TableWrapperRef = useRef();
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
    const resizeCallback = () => setTableWidth(rootElement.clientWidth);
    const scrollCallback = (evt) => handleScroll(evt, tableSection);
    const focusOutCallback = (evt) => !TableWrapperRef.current.contains(evt.relatedTarget) && keyboard.exit(false);

    window.addEventListener('resize', resizeCallback);
    tableSection.current.addEventListener('wheel', scrollCallback);
    TableWrapperRef.current.addEventListener('focusout', focusOutCallback);
    return () => {
      window.removeEventListener('resize', resizeCallback);
      tableSection.current.removeEventListener('wheel', scrollCallback);
      TableWrapperRef.current.removeEventListener('focusout', focusOutCallback);
    };
  }, [keyboard]);

  useEffect(() => {
    if (!keyboard.enabled) return;

    updateFocus(
      rootElement.getElementsByClassName('sn-table-row'),
      focusedCellCoord.current,
      keyboard.inFocus ? 'focus' : 'blur'
    );
  }, [keyboard.inFocus]);

  // Except for first render, whenever the size of the data changes (number of rows per page, rows or columns),
  // reset tabindex to first cell. If some cell had focus, focus the first cell as well.
  useDidUpdateEffect(() => {
    handleResetFocus(focusedCellCoord, rootElement, shouldRefocus, selectionsAPI.isModal());
  }, [rows.length, size.qcy, size.qcx]);

  return (
    <Paper
      className={classes.paper}
      ref={TableWrapperRef}
      onKeyDown={(evt) =>
        handleWrapperKeyDown(evt, size.qcy, page, rowsPerPage, handleChangePage, setShouldRefocus, keyboard)
      }
    >
      <TableContainer ref={tableSection} className={classes[containerMode]}>
        <Table stickyHeader aria-label={`showing ${rows.length + 1} rows and ${columns.length} columns`}>
          <TableHeadWrapper {...props} focusedCellCoord={focusedCellCoord} />
          <TableBodyWrapper {...props} focusedCellCoord={focusedCellCoord} setShouldRefocus={setShouldRefocus} />
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
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
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
  keyboard: PropTypes.object.isRequired,
};
